sub init()
    m.layers = m.top.findNode("backdrop-layers")
    m.current = m.top.findNode("backdrop-a")
    m.incoming = m.top.findNode("backdrop-b")
    m.fade = m.top.findNode("backdrop-fade")
    m.fadeIn = m.top.findNode("backdrop-fade-in")
    m.current.observeField("loadStatus", "onLoadStatus")
    m.incoming.observeField("loadStatus", "onLoadStatus")
    m.fade.observeField("state", "onFadeState")
end sub

function uriFor(slug as string) as string
    return "pkg:/images/destinations/" + slug + "-backdrop.jpg"
end function

sub onSlug()
    uri = uriFor(m.top.slug)
    if m.current.uri = "" then
        m.current.uri = uri
        return
    end if
    if m.fade.state = "running" then
        ' A new place mid-fade: show the half-faded one fully and start over from it.
        m.fade.control = "stop"
        finishFade()
    end if
    if uri = m.current.uri then
        m.incoming.opacity = 0
        return
    end if
    m.incoming.opacity = 0
    m.incoming.uri = uri
    if m.incoming.loadStatus = "ready" then startFade()
end sub

sub onLoadStatus(event as object)
    poster = event.getRoSGNode()
    if poster.isSameNode(m.incoming) and event.getData() = "ready" and m.incoming.opacity = 0 then startFade()
end sub

sub startFade()
    m.fadeIn.fieldToInterp = m.incoming.id + ".opacity"
    m.fade.control = "start"
end sub

sub onFadeState()
    if m.fade.state = "stopped" and m.incoming.opacity >= 1 then finishFade()
end sub

' The incoming Poster becomes the current one, and the old current one
' becomes the next incoming (it keeps its image until the next place).
sub finishFade()
    m.incoming.opacity = 1
    old = m.current
    m.current = m.incoming
    m.incoming = old
    m.incoming.opacity = 0
    ' Draw the current Poster first (underneath) so the next fade-in is on top.
    m.layers.removeChild(m.current)
    m.layers.insertChild(m.current, 0)
end sub
