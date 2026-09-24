#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// Reads UIKit's reserved regions (iOS 27.1): the fold of a foldable
/// display ("division") and hardware that covers content ("occlusion").
///
/// Objective-C so the call can sit behind `__has_include`: the API only
/// exists in the iOS 27.1 SDK, and the app must still build with older
/// Xcodes (where it reports no regions, as it does on older iOS).
@interface AtlasReservedRegions : NSObject

/// Every division and occlusion region of `view`, active or not, as
/// dictionaries with `kind`, `x`, `y`, `width`, `height` (the view's
/// coordinate space, margins included) and `active`.
+ (NSArray<NSDictionary<NSString *, id> *> *)regionsInView:(UIView *)view;

@end

NS_ASSUME_NONNULL_END
