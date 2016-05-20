var React = require('react');
var boostrap = require('bootstrap');
var FAQ = React.createClass({

  render: function() {
    return (
      <div className="container p-t-md tf-faq">
        <span className="tf-static-page-header">Frequently Asked Questions</span>
        <h4>What is Trakfire?</h4>
        <p>
          Trakfire is an invite-only community of people who have the feel for music. It’s a place for tastemakers, both emerging and well known, to share their best finds from the vast seas of Soundcloud and YouTube. There's more noise out there than ever before, and worthy artistry often doesn't receive as much visibility as those with money, marketing, and connections. Our hope for Trakfire is to create a space where great music can surface up democratically, powered by people who love and know music.
        </p>
        <br />

        <h4>How can I get an invite?</h4>
        <p>
          Either an existing member +1's you or get approved via the request invite process.
        </p>
        
        <br />

        <h4>How does the leaderboard work?</h4>
        <p>
          Every upvote on your posts = 100 points
        </p>
        <br />
        
        <h4>Feedback / additional questions?</h4>
        <p>
          Tweet at us <a href="https://twitter.com/trakfiremusic" target="_blank">@trakfiremusic</a> or hit us up at arjun@trakfire.com & grant@trakfire.com.
        </p>
      </div>
    );
  },
});

module.exports = FAQ;