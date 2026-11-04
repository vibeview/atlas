' Atlas design tokens (the tv/ app's theme.ts). Coordinates are 1920x1080
' (ui_resolutions=fhd), the same design units the tv/ app uses.

function atlasColors() as object
    return {
        ink: "0x0B1016FF",
        raised: "0x151C25FF",
        text: "0xF4F6F8FF",
        soft: "0xB8C0CCFF",
        muted: "0x8792A2FF",
        lagoon: "0x0E7C86FF",
        amber: "0xF2A541FF",
        white: "0xFFFFFFFF"
    }
end function

' weight: "Medium", "Bold" or "ExtraBold" (the three cuts in pkg:/fonts).
function atlasFont(weight as string, size as integer) as object
    f = CreateObject("roSGNode", "Font")
    f.uri = "pkg:/fonts/Manrope-" + weight + ".ttf"
    f.size = size
    return f
end function

sub styleLabel(label as object, weight as string, size as integer, color as string)
    label.font = atlasFont(weight, size)
    label.color = color
end sub

' Clamps i into 0..count-1.
function clampIndex(i as integer, count as integer) as integer
    if i > count - 1 then i = count - 1
    if i < 0 then i = 0
    return i
end function
