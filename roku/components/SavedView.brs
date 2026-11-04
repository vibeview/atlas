sub init()
    c = atlasColors()
    styleLabel(m.top.findNode("saved-heading"), "ExtraBold", 56, c.text)
    m.empty = m.top.findNode("saved-empty")
    styleLabel(m.empty, "Medium", 28, c.soft)
    m.grid = m.top.findNode("saved-grid")
    m.grid.observeField("selected", "onGridSelected")
end sub

sub onItems()
    m.grid.items = m.top.items
    m.top.count = m.top.items.count()
    m.empty.visible = (m.top.items.count() = 0)
end sub

sub onFocusRequest()
    request = m.top.focusRequest
    if Left(request, 5) = "slug:" then
        slug = Mid(request, 6)
        i = 0
        for each d in m.top.items
            if d.slug = slug then
                m.grid.focusIndex = i
                return
            end if
            i = i + 1
        end for
    end if
    m.grid.focusIndex = m.grid.index
end sub

sub onGridSelected()
    m.top.selected = m.grid.selected
end sub

' No onKeyEvent: presses off the grid's edges (up off the first line, back)
' pass straight on to the scene.
