#Tesseract 

## Startup 

Once you have run `git clone` you must run two commands in the resulting folder in **two different terminal tabs**
* To start the rails terminal: `rails s -b 127.0.0.1`
* To start the node front end: `npm run devserve`

*I recommend you nopen three tabs right off the bat for development. One for node, one for rails and one for git and the rails console.*


## Common Git Stuff

* `git pull origin <branch>`
* `git branch <new branch>`
* `git checkout <branch to switch to>`
* `git fetch`
* `git merge <branch to merge into currently checkout branch>`
* `git stash`
* `git add -A`
* `git commit -m "msg"`
* `git push origin <branch>`
* Sometimes you'll get a message along the lines of "enter a message for why this merge is necessary". In these cases you'll be presented with the vi editor. Do as follows to complete the merge: 
  1. `i`
  2. Enter message
  3. `esc`
  4. `:wq`
  5. Hit enter 

## Terminal Scripting
Each of these commands assumes that you have executed 
`cd path/to/tesseract-api/`
`rails c`
 unless you are executing commands for the production build which is hosted by Heroku. In this case you will run
 `heroku run rails c -a trakfire-rails`. For more info on the heroku toolbelt including installation head over to <https://toolbelt.heroku.com/>.

### Posting as a bot user 
`load 'botPost.rb'`

You will be guided through a list of selection steps for the post and the user to post as

### Fetching Large Album Art for Posts
`load 'fetchLgArtwork.rb'`

Will check all posts for `post.img_url_lg == nil` and fetch the appropriate sized img if need be

### Getting a List of Records From a DB Table
`s = TableName.all`

s will then hold an array of all records in said table. You may then run: 
* `.count` for the array length
* `[idx].attr` for attributes on a single element in the array

### Finding Records 
To find a single record by id
`s = Table.Find(id)`

To find a record by attribute
`s = Table.where(attr: 'value')`

When searching by attribute you may be returned multiple records. To make things manageable you can specify a limit with `.limit(lim)`

### Altering a Record 
This assumes that `s` hold the singular object to alter

`s.attr = 'value'`
`s.save`

### Creating a Record by Hand
`u = Table.new()`
`u.attr1 = val1`
`u.attr2 = val2`
`u.save`

