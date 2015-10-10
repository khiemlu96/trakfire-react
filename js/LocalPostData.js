//LocalPostData.js
module.exports = {

  init: function() {
    localStorage.clear();
    localStorage.setItem('posts', JSON.stringify([
      {
        id: 'p_1',
        date: '10 6 2015',
        title: 'One Step Closer',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "http://hiphop-n-more.com/wp-content/uploads/2010/11/kanye-album-cover-2.jpg"
        },
        user: {
          id : 'u_1',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 99999
      },
      {
        id: 'p_2',
        date: '10 7 2015',        
        title: 'Numb',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://consequenceofsound.files.wordpress.com/2014/03/warondrugs_dream.jpg"
        },
        user: {
          id : 'u_2',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 89999
      },
      {
        id: 'p_3',
        date: '10 7 2015',
        title: 'New Divide',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 7,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://upload.wikimedia.org/wikipedia/en/3/39/DJKaskade_Strobelite.jpg"
        },
        user: {
          id : 'u_3',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 79999
      },
      {
        id: 'p_4',
        date: '10 7 2015',
        title: 'Catalyst',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://soundcloud.com/broderickbatts/wavey",
          thumbnail_url : "https://images.rapgenius.com/06a364b985e9b788d00775c2fe6c13ba.1000x1000x1.jpg"
        },
        user: {
          id : 'u_4',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 69999
      },
      {
        id: 'p_5',
        date: '10 7 2015',
        title: 'Giving Up',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 2,
        song : {
          stream_url : "https://soundcloud.com/broderickbatts/wavey",
          thumbnail_url : "http://assets.rollingstone.com/assets/2015/media/193124/_original/1429566130/1035x1035-MI0003834381.jpg"
        },
        user: {
          id : 'u_5',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 59999
      },
      {
        id: 'p_6',
        date: '10 7 2015',
        title: 'Numb/Encore',
        artist: 'Linkin Park Ft. Jay Z',
        genre: 'Hip Hop / R&B',
        created_at: 4,
        song : {
          stream_url : "https://soundcloud.com/broderickbatts/wavey",
          thumbnail_url : "https://upload.wikimedia.org/wikipedia/en/a/ac/Slave-Ambient.jpg"
        },
        user: {
          id : 'u_6',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 49999
      },
      {
        id: 'p_7',
        date: '10 7 2015',
        title: 'Breaking the Habit',
        artist: 'Linkin Park',
        genre: 'Electronic',
        created_at: 2,
        song : {
          stream_url : "https://soundcloud.com/broderickbatts/wavey",
          thumbnail_url : "https://images.rapgenius.com/06a364b985e9b788d00775c2fe6c13ba.1000x1000x1.jpg"
        },
        user: {
          id : 'u_7',
          img : 'killeruser.jpg'
        },
        timestamp: Date.now() - 39999
      }
    ]));
  }
};