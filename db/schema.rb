# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160524204502) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "applications", force: :cascade do |t|
    t.string   "name"
    t.string   "handle"
    t.string   "email"
    t.string   "artists"
    t.string   "statement"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "sc1"
    t.string   "sc2"
    t.string   "sc3"
  end

  create_table "bots", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "handle"
    t.string   "username"
  end

  create_table "comments", force: :cascade do |t|
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "post_id"
    t.integer  "parent_id"
    t.integer  "user_id"
    t.string   "comment_detail"
  end

  create_table "followers", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "follow_id",  null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "logs", force: :cascade do |t|
    t.string   "handle"
    t.string   "uid"
    t.string   "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "member_tags", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "read_time"
    t.datetime "sent_time"
    t.integer  "reference_id"
    t.string   "notification_type"
    t.text     "data"
    t.integer  "sender_id"
  end

  create_table "oauths", force: :cascade do |t|
    t.string "token",  null: false
    t.string "secret", null: false
  end

  add_index "oauths", ["token"], name: "index_oauths_on_token", using: :btree

  create_table "posts", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "song_id"
    t.string   "url"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "tags",          default: [],              array: true
    t.string   "genre"
    t.date     "date"
    t.integer  "play_count"
    t.integer  "votes"
    t.float    "score"
    t.integer  "vote_count"
    t.boolean  "isAdmin"
    t.string   "caption"
    t.string   "stream_url"
    t.string   "waveform_url"
    t.string   "duration"
    t.string   "artist"
    t.string   "title"
    t.string   "img_url"
    t.float    "dateinmill"
    t.string   "status"
    t.integer  "comment_count"
    t.string   "img_url_lg"
  end

  create_table "songs", force: :cascade do |t|
    t.string   "stream_url"
    t.string   "title"
    t.string   "thumb_url"
    t.string   "wav_url"
    t.string   "artist"
    t.string   "f_id"
    t.string   "genre"
    t.integer  "duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "post_id"
  end

  add_index "songs", ["post_id"], name: "index_songs_on_post_id", using: :btree

  create_table "staged_posts", force: :cascade do |t|
    t.string   "title"
    t.string   "artist"
    t.string   "genre"
    t.string   "stream_url"
    t.string   "img_url"
    t.string   "duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "status"
    t.string   "img_url_lg"
    t.string   "url"
  end

  create_table "taggings", force: :cascade do |t|
    t.integer  "post_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "taggings", ["post_id"], name: "index_taggings_on_post_id", using: :btree
  add_index "taggings", ["tag_id"], name: "index_taggings_on_tag_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.integer  "t_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tf_files", force: :cascade do |t|
    t.string   "name"
    t.string   "file_firebase_key"
    t.string   "preview_file_firebase_key"
    t.integer  "size"
    t.integer  "height"
    t.integer  "width"
    t.string   "file_type"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "email"
    t.string   "username"
    t.string   "provider"
    t.string   "uid"
    t.string   "img"
    t.string   "location"
    t.string   "tbio"
    t.boolean  "isAdmin"
    t.string   "handle"
    t.boolean  "canPost"
    t.float    "score"
    t.boolean  "isVerified"
    t.string   "original_profile_img"
    t.boolean  "bot",                  default: false
    t.float    "score_weekly",         default: 0.0
    t.string   "password"
  end

  add_index "users", ["uid"], name: "index_users_on_uid", using: :btree

  create_table "votes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.integer  "post_id"
  end

  create_table "whitelists", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "handle"
  end

  add_foreign_key "taggings", "posts"
  add_foreign_key "taggings", "tags"
end
