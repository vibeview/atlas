import ExpoModulesCore

public class AtlasFoldModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AtlasFold")

    View(FoldObserverView.self) {
      Events("onRegionsChange")
    }
  }
}
