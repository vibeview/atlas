#import "AtlasReservedRegions.h"

#if __has_include(<UIKit/UIViewReservedRegion.h>)
#define ATLAS_HAS_RESERVED_REGIONS 1
#endif

@implementation AtlasReservedRegions

+ (NSArray<NSDictionary<NSString *, id> *> *)regionsInView:(UIView *)view
{
  NSMutableArray<NSDictionary<NSString *, id> *> *out = [NSMutableArray array];
#ifdef ATLAS_HAS_RESERVED_REGIONS
  if (@available(iOS 27.1, *)) {
    UIViewReservedRegionQueryOptions options = UIViewReservedRegionQueryOptionsIncludeInactive;
    [self append:[view reservedRegionsOfKind:UIViewReservedRegionKind.divisionRegionKind options:options]
            kind:@"division"
              to:out];
    [self append:[view reservedRegionsOfKind:UIViewReservedRegionKind.occlusionRegionKind options:options]
            kind:@"occlusion"
              to:out];
  }
#endif
  return out;
}

#ifdef ATLAS_HAS_RESERVED_REGIONS
+ (void)append:(NSArray<UIViewReservedRegion *> *)regions
          kind:(NSString *)kind
            to:(NSMutableArray<NSDictionary<NSString *, id> *> *)out API_AVAILABLE(ios(27.1))
{
  for (UIViewReservedRegion *region in regions) {
    CGRect frame = region.frame;
    [out addObject:@{
      @"kind" : kind,
      @"x" : @(frame.origin.x),
      @"y" : @(frame.origin.y),
      @"width" : @(frame.size.width),
      @"height" : @(frame.size.height),
      @"active" : @(region.isActive),
    }];
  }
}
#endif

@end
