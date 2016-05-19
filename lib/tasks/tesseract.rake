namespace :tesseract do
  task bot_vote: :environment do
    choice = rand(0..10)
    if choice >= Bot.count
      puts "no bot will vote this run"
    else
      bot = Bot.find(choice)
      puts "#{bot.handle} will vote this run"
      bot.vote
    end
  end
end