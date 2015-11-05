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

ActiveRecord::Schema.define(version: 20151102032138) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "oauths", force: :cascade do |t|
    t.string "token",  null: false
    t.string "secret", null: false
  end

  add_index "oauths", ["token"], name: "index_oauths_on_token", using: :btree

  create_table "posts", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "song_id"
    t.string   "url"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "tags",         default: [],              array: true
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

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

  add_foreign_key "taggings", "posts"
  add_foreign_key "taggings", "tags"
end
