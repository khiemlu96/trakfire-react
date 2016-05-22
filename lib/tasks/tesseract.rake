namespace :tesseract do

  desc "Randomly select a bot to vote"
  task bot_vote: :environment do
    choice = rand(1..11)
    if choice >= Bot.count
      puts "no bot will vote this run"
    else
      bot = Bot.find(choice)
      puts "#{bot.handle} will vote this run"
      bot.vote
    end
  end

  desc "Reset the weekly score for each user"
  task reset_week_score: :environment do 
    users = User.all
    users.each do |u|
      u.score_weekly = 0.0
      u.save
    end 
  end

end