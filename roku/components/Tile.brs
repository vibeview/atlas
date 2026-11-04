sub init()
    m.shadow = m.top.getChild(0)
    m.ring = m.top.getChild(1)
    m.bg = m.top.getChild(2)
    m.photo = m.top.getChild(3)
    m.scrim = m.top.getChild(4)
    m.name = m.top.getChild(5)
    styleLabel(m.name, "Bold", m.top.labelSize, atlasColors().text)
    m.top.focusable = true
    m.top.observeField("focusedChild", "onFocusChanged")
    layout()
end sub

sub layout()
    w = m.top.tileWidth
    h = m.top.tileHeight
    ' The 8 px ring sits outside the photo; the shadow is offset down like tv/.
    m.ring.translation = [-8, -8]
    m.ring.width = w + 16
    m.ring.height = h + 16
    m.shadow.translation = [-36, -20]
    m.shadow.width = w + 72
    m.shadow.height = h + 72
    for each node in [m.bg, m.photo, m.scrim]
        node.width = w
        node.height = h
    end for
    m.name.translation = [20, 0]
    m.name.width = w - 40
    m.name.height = h - 16
    m.top.scaleRotateCenter = [w / 2, h / 2]
end sub

sub onLabelSize()
    styleLabel(m.name, "Bold", m.top.labelSize, atlasColors().text)
end sub

sub onDestination()
    d = m.top.destination
    if d = invalid then return
    m.top.id = m.top.prefix + "-" + d.slug
    m.photo.uri = "pkg:/images/destinations/" + d.slug + "-tile.jpg"
    m.name.text = d.name
end sub

sub onFocusChanged()
    focused = m.top.hasFocus()
    m.ring.visible = focused
    m.shadow.visible = focused
    if focused then
        m.top.scale = [1.1, 1.1]
    else
        m.top.scale = [1.0, 1.0]
    end if
end sub
