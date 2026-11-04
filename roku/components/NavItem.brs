sub init()
    m.pill = m.top.getChild(0)
    m.label = m.top.getChild(1)
    m.colors = atlasColors()
    m.label.font = atlasFont("Bold", 28)
    m.height = 58
    m.top.focusable = true
    m.top.observeField("focusedChild", "render")
    if m.top.text <> "" then onText()
end sub

sub onText()
    ' Measure the text at its natural width, not the width set last time.
    m.label.width = 0
    m.label.text = m.top.text
    w = m.label.localBoundingRect().width + 48
    m.top.itemWidth = w
    m.pill.width = w
    m.pill.height = m.height
    m.label.width = w
    m.label.height = m.height
    render()
end sub

sub render()
    if m.top.hasFocus() then
        m.pill.visible = true
        m.pill.blendColor = m.colors.text
        m.pill.opacity = 1
        m.label.color = m.colors.ink
    else if m.top.current then
        m.pill.visible = true
        m.pill.blendColor = m.colors.white
        m.pill.opacity = 0.14
        m.label.color = m.colors.text
    else
        m.pill.visible = false
        m.label.color = m.colors.soft
    end if
end sub
