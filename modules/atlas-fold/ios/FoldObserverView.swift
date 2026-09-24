import ExpoModulesCore
import UIKit

/// An invisible, full-window view that tells JS where the display's reserved
/// regions are: the fold of iPhone Duo's inner display, and the cameras.
///
/// Regions are re-read whenever UIKit lays the view out (resizes, rotation,
/// moving between the cover and inner displays) and, because a fold can go
/// from inactive (flat) to active (partly folded) without any size change,
/// on a short timer while the view is on screen. Only changes are sent.
final class FoldObserverView: ExpoView {
  let onRegionsChange = EventDispatcher()

  private var lastRegions: [[String: Any]]?
  private var timer: Timer?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    isUserInteractionEnabled = false
    backgroundColor = .clear
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    report()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    timer?.invalidate()
    timer = nil
    guard window != nil else { return }
    report()
    timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
      self?.report()
    }
  }

  private func report() {
    let regions = AtlasReservedRegions.regions(in: self)
    if let last = lastRegions, (last as NSArray).isEqual(to: regions) { return }
    lastRegions = regions
    onRegionsChange(["regions": regions])
  }
}
