' Navigation rules (the same as the tv/ app):
' - Focus on a top-bar item shows its tab; down enters the tab.
' - Up off the top of a tab reaches the current top-bar item.
' - Back on Search or Saved returns to Home with focus on the last Home tile;
'   Back on Home exits the channel (left to the platform).
' - Back on Destination returns to where it was opened, focus on that tile.

sub init()
    m.top.backgroundURI = ""
    m.top.backgroundColor = atlasColors().ink

    data = ParseJson(ReadAsciiFile("pkg:/data/destinations.json"))
    m.bySlug = {}
    for each d in data.destinations
        m.bySlug[d.slug] = d
    end for
    m.destinations = data.destinations
    m.saved = []
    for each slug in data.seedSaved
        m.saved.push(slug)
    end for

    m.nav = m.top.findNode("nav")
    m.home = m.top.findNode("home")
    m.search = m.top.findNode("search")
    m.savedView = m.top.findNode("saved")
    m.destination = m.top.findNode("destination")
    m.views = { home: m.home, search: m.search, saved: m.savedView }
    m.shownTab = "home"
    m.opened = invalid

    m.home.rows = data.rows
    m.home.bySlug = m.bySlug
    m.search.destinations = m.destinations
    refreshSaved()

    m.nav.observeField("shown", "onNavShown")
    m.home.observeField("selected", "onSelected")
    m.search.observeField("selected", "onSelected")
    m.savedView.observeField("selected", "onSelected")
    m.destination.observeField("closeRequested", "onDestinationClosed")
    m.destination.observeField("saveToggled", "onSaveToggled")

    m.home.focusRequest = "first"
end sub

sub refreshSaved()
    items = []
    for each slug in m.saved
        if m.bySlug.DoesExist(slug) then items.push(m.bySlug[slug])
    end for
    m.savedView.items = items
end sub

sub showTab(which as string)
    m.shownTab = which
    for each key in m.views
        m.views[key].visible = (key = which)
    end for
    m.nav.current = which
end sub

sub onNavShown()
    if m.nav.shown <> m.shownTab then showTab(m.nav.shown)
end sub

sub focusTab()
    if m.shownTab = "home" then
        m.home.focusRequest = "current"
    else if m.shownTab = "search" then
        m.search.focusRequest = "keyboard"
    else if m.savedView.count > 0 then
        m.savedView.focusRequest = "current"
    end if
end sub

sub onSelected(event as object)
    choice = event.getData()
    m.opened = { slug: choice.slug, index: choice.index }
    d = m.bySlug[choice.slug]
    m.views[m.shownTab].visible = false
    m.nav.visible = false
    m.destination.destination = d
    m.destination.saved = isSaved(d.slug)
    m.destination.visible = true
    m.destination.focusRequest = "plan"
end sub

sub onDestinationClosed()
    m.destination.visible = false
    m.nav.visible = true
    m.views[m.shownTab].visible = true
    if m.shownTab = "home" then
        m.home.focusRequest = "current"
    else if m.shownTab = "search" then
        m.search.focusRequest = "current"
    else
        target = returnTarget(m.opened.slug, m.opened.index)
        if target = invalid then m.nav.focusTab = "saved" else m.savedView.focusRequest = "slug:" + target
    end if
end sub

function isSaved(slug as string) as boolean
    for each s in m.saved
        if s = slug then return true
    end for
    return false
end function

sub onSaveToggled()
    slug = m.destination.destination.slug
    if isSaved(slug) then
        kept = []
        for each s in m.saved
            if s <> slug then kept.push(s)
        end for
        m.saved = kept
    else
        m.saved.push(slug)
    end if
    m.destination.saved = isSaved(slug)
    refreshSaved()
end sub

' tv/src/lib/saved.ts returnTarget: the place itself if still saved; after an
' unsave, the tile that moved into its slot (or the new last one); invalid
' when Saved is now empty.
function returnTarget(slug as string, index as integer) as dynamic
    if isSaved(slug) then return slug
    if m.saved.count() = 0 then return invalid
    if index > m.saved.count() - 1 then index = m.saved.count() - 1
    return m.saved[index]
end function

' Presses no view used.
function onKeyEvent(key as string, press as boolean) as boolean
    if not press or m.destination.visible then return false
    if key = "up" then
        m.nav.focusTab = m.shownTab
        return true
    else if key = "down" then
        if m.nav.isInFocusChain() then focusTab()
        return true
    else if key = "back" then
        if m.shownTab = "home" then return false
        showTab("home")
        m.home.focusRequest = "current"
        return true
    end if
    return false
end function
