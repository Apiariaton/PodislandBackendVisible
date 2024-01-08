const db = require('../DBConnect/initialise');
//const podData = require("../DBConnect/allPodcasts/data.js");
  

  const collectionRef = db.collection("podcasts");
  
  //Add individual item to Firestore
  // async function setPodcastData(){
  //   let podDoc = collectionRef.doc("pod37");
  //   await podDoc.set({"wrapperType":"track", "kind":"podcast", "artistId":121676617, "collectionId":342735925, "trackId":342735925, "artistName":"BBC Radio 4", "collectionName":"Desert Island Discs", "trackName":"Desert Island Discs", "collectionCensoredName":"Desert Island Discs", "trackCensoredName":"Desert Island Discs", "artistViewUrl":"https://podcasts.apple.com/us/artist/bbc/121676617?uo=4", "collectionViewUrl":"https://podcasts.apple.com/us/podcast/desert-island-discs/id342735925?uo=4", "feedUrl":"https://podcasts.files.bbci.co.uk/b006qnmr.rss", "trackViewUrl":"https://podcasts.apple.com/us/podcast/desert-island-discs/id342735925?uo=4", "artworkUrl30":"https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e4/b2/7b/e4b27bb0-04ea-2209-d9f8-627004eb5de6/mza_10994496187870344653.jpg/30x30bb.jpg", "artworkUrl60":"https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e4/b2/7b/e4b27bb0-04ea-2209-d9f8-627004eb5de6/mza_10994496187870344653.jpg/60x60bb.jpg", "artworkUrl100":"https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e4/b2/7b/e4b27bb0-04ea-2209-d9f8-627004eb5de6/mza_10994496187870344653.jpg/100x100bb.jpg", "collectionPrice":0.00, "trackPrice":0.00, "collectionHdPrice":0, "releaseDate":"2023-11-19T00:33:00Z", "collectionExplicitness":"notExplicit", "trackExplicitness":"cleaned", "trackCount":300, "trackTimeMillis":2161, "country":"USA", "currency":"USD", "primaryGenreName":"Personal Journals", "contentAdvisoryRating":"Clean", "artworkUrl600":"https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e4/b2/7b/e4b27bb0-04ea-2209-d9f8-627004eb5de6/mza_10994496187870344653.jpg/600x600bb.jpg", "genreIds":["1302", "26", "1324"], "genres":["Personal Journals", "Podcasts", "Society & Culture"]});
  // };
  // setPodcastData();

  //Add all items to Firestore 
  const podcastObjectArray = podData;
  
  podcastObjectArray.forEach(async (podcast, index = 0) => {
    let podID = "pod" + String(index++);
    let podDoc = collectionRef.doc(podID);
    await podDoc.set(podcast);
  });