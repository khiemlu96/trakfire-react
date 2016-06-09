var React = require('react');
var boostrap = require('bootstrap');
var FAQ = React.createClass({

  render: function() {
    return (
      <div className="container p-t-md tf-faq">
        <span className="tf-static-page-header">Frequently Asked Questions</span>
        <h4>What is Trakfire?</h4>
        <p>
          Trakfire is a community of people who have the feel for music. It’s a place for tastemakers, both no-names and brand names, to share their best finds from the vast seas of Soundcloud and YouTube. There's more noise out there than ever before, and worthy artistry often doesn't receive as much visibility as those with money, marketing, and connections. Our goal is to 1) create a space where great music can surface democratically, powered by people who love and know music, and 2) move the needle in music culture as a collective mass.
        </p>
        <br />

        <h4>How can I get an invite?</h4>
        <p>
          Either an existing member +1's you in, or get approved via the request invite process.
        </p>
        
        <br />
        
        <h4>How do I know if a song has been posted already?</h4>
        <p>
          Try posting it and we'll let you know if you're late.
        </p>
        
        <br />

        <h4>How does the leaderboard work?</h4>
        <p>
          Each upvote on your posts = 70 points. Weekly points reset every Sunday at 12am PST.
        </p>
        <br />
        
        <h4>Feedback / additional questions</h4>
        <p>
          Tweet at us <a href="https://twitter.com/trakfiremusic" target="_blank">@trakfiremusic</a> or hit us up at arjun@trakfire.com & grant@trakfire.com.
        </p>
      </div>
    );
  },
});

module.exports = FAQ;
