sub init()
    brand = m.top.findNode("nav-brand")
    styleLabel(brand, "ExtraBold", 36, atlasColors().text)
    m.tabs = ["home", "search", "saved"]
    m.items = [m.top.findNode("nav-home"), m.top.findNode("nav-search"), m.top.findNode("nav-saved")]
    x = 96 + brand.localBoundingRect().width + 48
    for each item in m.items
        item.translation = [x, 54]
        x = x + item.itemWidth + 8
    end for
    onCurrent()
end sub

sub onCurrent()
    for i = 0 to 2
        m.items[i].current = (m.tabs[i] = m.top.current)
    end for
end sub

sub onFocusTab()
    i = indexOf(m.top.focusTab)
    if i >= 0 then m.items[i].setFocus(true)
end sub

function indexOf(which as string) as integer
    for i = 0 to 2
        if m.tabs[i] = which then return i
    end for
    return -1
end function

function focusedIndex() as integer
    for i = 0 to 2
        if m.items[i].hasFocus() then return i
    end for
    return -1
end function

function onKeyEvent(key as string, press as boolean) as boolean
    if not press then return false
    i = focusedIndex()
    if i < 0 then return false
    if key = "left" or key = "right" then
        if key = "left" then j = i - 1 else j = i + 1
        if j >= 0 and j <= 2 then
            m.items[j].setFocus(true)
            m.top.shown = m.tabs[j]
        end if
        return true
    else if key = "up" then
        return true
    else if key = "OK" then
        m.top.shown = m.tabs[i]
        return true
    end if
    ' down and back go to the scene
    return false
end function
