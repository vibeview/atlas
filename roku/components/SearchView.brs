' Focus moves between the keyboard and the results. The keyboard handles
' presses inside itself; presses off its edges reach onKeyEvent here. Up off
' the keyboard, or off the results' first line, is left to the scene (the top
' bar).

sub init()
    c = atlasColors()
    m.keyboard = m.top.findNode("search-keyboard")
    m.keyboard.textEditBox.id = "search-field"
    m.keyboard.textEditBox.hintText = "Search places or countries"
    m.keyboard.keyColor = c.soft
    m.keyboard.focusedKeyColor = c.ink
    m.keyboard.observeField("text", "filter")
    m.heading = m.top.findNode("search-heading")
    m.empty = m.top.findNode("search-empty")
    m.grid = m.top.findNode("search-results")
    styleLabel(m.heading, "Bold", 30, c.text)
    styleLabel(m.empty, "Medium", 28, c.soft)
    m.grid.observeField("selected", "onGridSelected")
    m.zone = "keyboard"
end sub

sub filter()
    query = LCase(m.keyboard.text).Trim()
    matches = []
    for each d in m.top.destinations
        if query = "" or d.searchName.Instr(query) >= 0 or d.searchCountry.Instr(query) >= 0 then matches.push(d)
    end for
    m.grid.items = matches
    m.heading.visible = (query = "")
    m.empty.visible = (matches.count() = 0)
    m.empty.text = "No places match " + Chr(8220) + m.keyboard.text.Trim() + Chr(8221) + "."
    if query <> "" then m.grid.translation = [760, 160] else m.grid.translation = [760, 222]
    if m.zone = "results" then
        if matches.count() = 0 then focusKeyboard() else m.grid.focusIndex = m.grid.index
    end if
end sub

sub onFocusRequest()
    if m.top.focusRequest = "current" and m.zone = "results" and m.grid.count > 0 then
        m.grid.focusIndex = m.grid.index
    else
        focusKeyboard()
    end if
end sub

sub focusKeyboard()
    m.zone = "keyboard"
    m.keyboard.setFocus(true)
end sub

sub onGridSelected()
    m.top.selected = m.grid.selected
end sub

function onKeyEvent(key as string, press as boolean) as boolean
    if not press then return false
    if m.zone = "keyboard" then
        if (key = "right" or key = "down") and m.grid.count > 0 then
            m.zone = "results"
            m.grid.focusIndex = m.grid.index
            return true
        end if
        ' up goes to the scene (the top bar); back too
        return false
    end if
    ' Results: the grid passed this press on, so it is off the grid's edge.
    if key = "left" then
        focusKeyboard()
        return true
    end if
    if key = "up" then m.zone = "keyboard"
    return false
end function
