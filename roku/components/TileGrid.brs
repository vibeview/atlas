sub init()
    m.clip = m.top.getChild(0)
    m.content = m.clip.getChild(0)
    m.tiles = []
    m.offset = 0
end sub

sub build()
    m.content.removeChildrenIndex(m.content.getChildCount(), 0)
    m.tiles = []
    cols = m.top.columns
    w = m.top.tileWidth
    h = m.top.tileHeight
    for each d in m.top.items
        i = m.tiles.count()
        tile = m.content.createChild("Tile")
        tile.prefix = m.top.prefix
        tile.tileWidth = w
        tile.tileHeight = h
        tile.labelSize = m.top.labelSize
        tile.translation = [(i mod cols) * (w + m.top.gapX), (i \ cols) * (h + m.top.gapY)]
        tile.destination = d
        m.tiles.push(tile)
    end for
    m.top.count = m.tiles.count()
    ' Room for the focused tile's lift, ring and shadow on every side.
    m.clip.clippingRect = [-48, -36, cols * (w + m.top.gapX) + 64, m.top.viewHeight + 36]
    m.offset = 0
    m.content.translation = [0, 0]
    if m.top.index > m.tiles.count() - 1 then m.top.index = 0
end sub

sub onFocusIndex()
    focus(m.top.focusIndex)
end sub

sub focus(i as integer)
    if m.tiles.count() = 0 then return
    i = clampIndex(i, m.tiles.count())
    m.top.index = i
    pitch = m.top.tileHeight + m.top.gapY
    top = (i \ m.top.columns) * pitch
    bottom = top + m.top.tileHeight
    if bottom - m.offset > m.top.viewHeight then m.offset = bottom - m.top.viewHeight
    if top < m.offset then m.offset = top
    m.content.translation = [0, -m.offset]
    m.tiles[i].setFocus(true)
end sub

function onKeyEvent(key as string, press as boolean) as boolean
    if not press or m.tiles.count() = 0 then return false
    i = m.top.index
    cols = m.top.columns
    if key = "left" then
        if i mod cols = 0 then return false
        focus(i - 1)
        return true
    else if key = "right" then
        if i mod cols = cols - 1 or i = m.tiles.count() - 1 then return true
        focus(i + 1)
        return true
    else if key = "down" then
        if i + cols <= m.tiles.count() - 1 then
            focus(i + cols)
        else if (i \ cols) < ((m.tiles.count() - 1) \ cols) then
            focus(m.tiles.count() - 1)
        end if
        return true
    else if key = "up" then
        if i - cols < 0 then return false
        focus(i - cols)
        return true
    else if key = "OK" then
        m.top.selected = { slug: m.tiles[i].destination.slug, index: i }
        return true
    end if
    return false
end function
