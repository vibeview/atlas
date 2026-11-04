sub init()
    c = atlasColors()
    m.colors = c
    m.backdrop = m.top.findNode("destination-backdrop")
    m.country = m.top.findNode("destination-country")
    m.name = m.top.findNode("destination-name")
    m.tags = m.top.findNode("destination-tags")
    m.description = m.top.findNode("destination-description")
    m.facts = m.top.findNode("destination-facts")
    m.plan = m.top.findNode("btn-plan-trip")
    m.save = m.top.findNode("btn-save")
    m.toast = m.top.findNode("destination-toast")
    m.panel = m.top.findNode("destination-panel")
    m.experiences = m.top.findNode("destination-experiences")
    m.timer = m.top.findNode("destination-toast-timer")
    styleLabel(m.country, "Bold", 28, c.soft)
    styleLabel(m.name, "ExtraBold", 96, c.text)
    styleLabel(m.tags, "Bold", 28, c.soft)
    styleLabel(m.description, "Medium", 28, c.text)
    styleLabel(m.toast, "Bold", 26, c.text)
    m.timer.observeField("fire", "hideToast")
    layoutButtons()
end sub

sub layoutButtons()
    y = m.plan.translation[1]
    m.save.translation = [96 + m.plan.buttonWidth + 20, y]
    m.toast.translation = [96 + m.plan.buttonWidth + 20 + m.save.buttonWidth + 32, y]
end sub

sub onDestination()
    d = m.top.destination
    if d = invalid then return
    c = m.colors
    m.backdrop.uri = "pkg:/images/destinations/" + d.slug + "-backdrop.jpg"
    m.country.text = UCase(d.country)
    m.name.text = d.name
    m.tags.text = d.tags.Join("  ·  ")
    m.description.text = d.description

    m.facts.removeChildrenIndex(m.facts.getChildCount(), 0)
    ' Column widths as the tv/ app lays them out: time zone is short.
    x = 0
    for each fact in [["Best time", d.bestMonths, 360], ["Time zone", d.timeZone, 150], ["Nearest airport", d.airport, 400]]
        label = m.facts.createChild("Label")
        label.text = fact[0]
        label.translation = [x, 0]
        styleLabel(label, "Bold", 22, c.muted)
        value = m.facts.createChild("Label")
        value.text = fact[1]
        value.translation = [x, 38]
        value.width = fact[2]
        value.wrap = true
        value.maxLines = 2
        value.lineSpacing = 0
        styleLabel(value, "Bold", 26, c.text)
        x = x + fact[2] + 48
    end for

    m.experiences.removeChildrenIndex(m.experiences.getChildCount(), 0)
    heading = m.experiences.createChild("Label")
    heading.text = "Top experiences"
    styleLabel(heading, "Bold", 30, c.text)
    y = 74
    i = 1
    for each e in d.experiences
        marker = m.experiences.createChild("Poster")
        marker.uri = "pkg:/images/pill.9.png"
        marker.blendColor = c.lagoon
        marker.width = 56
        marker.height = 56
        marker.translation = [0, y + 20]
        number = m.experiences.createChild("Label")
        number.text = "0" + i.toStr()
        number.width = 56
        number.height = 56
        number.horizAlign = "center"
        number.vertAlign = "center"
        number.translation = [0, y + 20]
        styleLabel(number, "Bold", 22, c.text)
        title = m.experiences.createChild("Label")
        title.text = e.title
        title.translation = [78, y]
        title.width = 482
        styleLabel(title, "Bold", 28, c.text)
        line = m.experiences.createChild("Label")
        line.text = e.line
        line.translation = [78, y + 40]
        line.width = 482
        line.wrap = true
        line.maxLines = 2
        line.lineSpacing = 0
        styleLabel(line, "Medium", 24, c.soft)
        y = y + 129
        i = i + 1
    end for
    m.panel.height = y + 26
    hideToast()
end sub

sub onSaved()
    m.save.active = m.top.saved
    if m.top.saved then m.save.text = "Saved" else m.save.text = "Save"
    layoutButtons()
end sub

sub onFocusRequest()
    m.plan.setFocus(true)
end sub

sub showToast()
    m.toast.visible = true
    m.timer.control = "stop"
    m.timer.control = "start"
end sub

sub hideToast()
    m.timer.control = "stop"
    m.toast.visible = false
end sub

function onKeyEvent(key as string, press as boolean) as boolean
    if not press then return false
    if key = "back" then
        hideToast()
        m.top.closeRequested = true
        return true
    else if key = "right" then
        m.save.setFocus(true)
        return true
    else if key = "left" then
        m.plan.setFocus(true)
        return true
    else if key = "OK" then
        if m.plan.hasFocus() then
            showToast()
        else if m.save.hasFocus() then
            m.top.saveToggled = true
        end if
        return true
    end if
    ' up and down have nowhere to go on this screen
    return true
end function
