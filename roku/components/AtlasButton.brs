sub init()
    m.bg = m.top.getChild(0)
    m.label = m.top.getChild(1)
    m.colors = atlasColors()
    m.label.font = atlasFont("Bold", 30)
    m.height = 76
    m.top.focusable = true
    m.top.observeField("focusedChild", "render")
    if m.top.text <> "" then onText()
end sub

sub onText()
    ' Measure the text at its natural width, not the width set last time.
    m.label.width = 0
    m.label.text = m.top.text
    w = m.label.localBoundingRect().width + 80
    if w < 180 then w = 180
    m.top.buttonWidth = w
    m.bg.width = w
    m.bg.height = m.height
    m.label.width = w
    m.label.height = m.height
    m.top.scaleRotateCenter = [w / 2, m.height / 2]
    render()
end sub

sub render()
    focused = m.top.hasFocus()
    if focused then
        m.bg.blendColor = m.colors.text
        m.bg.opacity = 1
        m.label.color = m.colors.ink
        m.top.scale = [1.06, 1.06]
    else
        m.top.scale = [1.0, 1.0]
        if m.top.tone = "primary" then
            m.bg.blendColor = m.colors.lagoon
            m.bg.opacity = 1
        else
            m.bg.blendColor = m.colors.white
            m.bg.opacity = 0.14
        end if
        if m.top.active then m.label.color = m.colors.amber else m.label.color = m.colors.text
    end if
end sub
