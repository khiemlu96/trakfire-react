Algolia.init :application_id => "JINS7FFC4L", :api_key => "07e2bcbe576a0549b8dfbca2b554fc60"

def load_data_from_database
  records = Post.all.limit(1000)
  return records
end

index = Algolia::Index.new("posts")
# `load_data_from_database` must return an array of Hash representing your objects
load_data_from_database.each_slice(1000) do |batch|
  index.add_objects(batch)
end