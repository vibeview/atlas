' Focus is SceneGraph focus on the Tile nodes; this view only decides which
' tile receives it for each remote press. Up from the first row and Back are
' left to the scene (the top bar, and Home's own exit).

sub init()
    c = atlasColors()
    m.backdrop = m.top.findNode("home-backdrop")
    m.country = m.top.findNode("home-country")
    m.name = m.top.findNode("home-name")
    m.tagline = m.top.findNode("home-tagline")
    m.tags = m.top.findNode("home-tags")
    styleLabel(m.country, "Bold", 28, c.soft)
    styleLabel(m.name, "ExtraBold", 96, c.text)
    styleLabel(m.tagline, "Medium", 40, c.text)
    styleLabel(m.tags, "Bold", 28, c.soft)
    m.rowsNode = m.top.findNode("home-rows")
    m.scroll = m.top.findNode("home-scroll")
    m.scrollTo = m.top.findNode("home-scroll-to")
    m.tileW = 400
    m.tileGap = 32
    m.rowPitch = 344
    m.window = 1728 ' the safe area's width: tiles slide to stay inside it
    m.strips = []
    m.tiles = []
    m.offset = []
    m.col = []
    m.row = 0
end sub

sub build()
    c = atlasColors()
    m.rowsNode.removeChildrenIndex(m.rowsNode.getChildCount(), 0)
    m.strips = []
    m.tiles = []
    m.offset = []
    m.col = []
    r = 0
    for each row in m.top.rows
        group = m.rowsNode.createChild("Group")
        group.translation = [0, r * m.rowPitch]
        title = group.createChild("Label")
        title.text = row.title
        title.translation = [96, 0]
        styleLabel(title, "Bold", 30, c.text)
        strip = group.createChild("Group")
        strip.translation = [96, 68]
        tiles = []
        for each slug in row.slugs
            tile = strip.createChild("Tile")
            tile.prefix = "tile"
            tile.translation = [tiles.count() * (m.tileW + m.tileGap), 0]
            tile.destination = m.top.bySlug[slug]
            tiles.push(tile)
        end for
        m.strips.push(strip)
        m.tiles.push(tiles)
        m.offset.push(0)
        m.col.push(0)
        r = r + 1
    end for
end sub

sub onFocusRequest()
    if m.tiles.count() = 0 then return
    if m.top.focusRequest = "first" then
        focusTile(0, 0, false)
    else
        focusTile(m.row, m.col[m.row], false)
    end if
end sub

sub focusTile(r as integer, c as integer, animate as boolean)
    r = clampIndex(r, m.tiles.count())
    c = clampIndex(c, m.tiles[r].count())
    if r <> m.row or m.rowsNode.translation[1] <> -r * m.rowPitch then scrollToRow(r, animate)
    m.row = r
    m.col[r] = c
    scrollStrip(r, c)
    tile = m.tiles[r][c]
    tile.setFocus(true)
    showPlace(tile.destination)
end sub

sub scrollToRow(r as integer, animate as boolean)
    target = [0, -r * m.rowPitch]
    m.scroll.control = "stop"
    if animate then
        m.scrollTo.keyValue = [m.rowsNode.translation, target]
        m.scroll.control = "start"
    else
        m.rowsNode.translation = target
    end if
end sub

' Slide a row's strip so tile c is fully inside the safe area.
sub scrollStrip(r as integer, c as integer)
    left = c * (m.tileW + m.tileGap)
    right = left + m.tileW
    offset = m.offset[r]
    if right - offset > m.window then offset = right - m.window
    if left < offset then offset = left
    if offset <> m.offset[r] then
        m.offset[r] = offset
        m.strips[r].translation = [96 - offset, 68]
    end if
end sub

sub showPlace(d as object)
    m.backdrop.slug = d.slug
    m.country.text = UCase(d.country)
    m.name.text = d.name
    m.tagline.text = d.tagline
    m.tags.text = d.tags.Join("  ·  ")
end sub

function onKeyEvent(key as string, press as boolean) as boolean
    if not press or m.tiles.count() = 0 then return false
    if key = "left" then
        focusTile(m.row, m.col[m.row] - 1, true)
        return true
    else if key = "right" then
        focusTile(m.row, m.col[m.row] + 1, true)
        return true
    else if key = "down" then
        if m.row < m.tiles.count() - 1 then focusTile(m.row + 1, m.col[m.row + 1], true)
        return true
    else if key = "up" then
        if m.row = 0 then return false
        focusTile(m.row - 1, m.col[m.row - 1], true)
        return true
    else if key = "OK" then
        m.top.selected = { slug: m.tiles[m.row][m.col[m.row]].destination.slug, index: m.col[m.row] }
        return true
    end if
    return false
end function
