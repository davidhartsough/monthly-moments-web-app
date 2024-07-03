# Monthly Moments

Layout
=> Nav = / Home + / Add + / Me
=> [Routes]

Routes

/ Home
: Recaps
(Search)
(List of connections = Links = :[Name] + :[username])
(Link to / Search = :"Find More Friends")

/ Add
: Your Moments this month
: [month]
(Big textarea + Big "Add" button)
(List of moments = :[text] + Edit button)

/ Me
: [Name]
: [username]
Links
= {Requests [if]} = Link -> / Requests
= Monthly Recaps = Link -> / Profile
= Find Friends = Link -> / Search
// = Reminders = Link -> / Reminders
= Edit Name = Link -> / Edit Name
= Sign Out = Button (trigger auth func)

/ Search
: Find Friends
(Search)
(List of results)

/ p/:id:/:month: [Profile]
: [Name]
: [username]
(Month Picker)
(List of Moments)

/ Requests
: Requests
(List of Requests = :[Name] + :[username] + "Accept" or "Ignore" buttons)

// MAYBE SOON:
/ Reminders
: Writing Reminder
(toggle button :"Turn Off" or "Turn On")
On the {28th} @ {7pm}
: Reading Reminder
(toggle button :"Turn Off" or "Turn On")
On the {3rd} @ {7pm}
