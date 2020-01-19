import React, { Component } from "react";
import classes from "./App.module.css";

import Posts from "../components/Posts/Posts";
import Toolbar from "../components/Toolbar/Toolbar";

import testPost from "../assets/test_data";

class App extends Component {
  constructor(props) {
    super(props);
    console.log("[App.js] constructor");
  }

  state = {
    showNSFW: false,
    lastPostID: "",
    posts: [testPost],
    blacklist: []
  };

  componentDidMount() {
    this.fetchPosts("init");
  }

  // filter function that sets the state and calls for a re-render
  filterData = responseItem => {

    // ... code here; edit response Item

    responseItem = JSON.parse(responseItem);
    let unfilteredPosts = responseItem.data.children;
    // console.log(unfilteredPosts);
    let filteredPosts = [];
    let lastID = "";

    for (var i = 0; i < unfilteredPosts.length; i++) {
      filteredPosts.push({

        // if (unfilteredPosts[i].data.over_18 == true && this.state.showNSFW == false) ||
        //     (this.state.blacklist.includes(unfilteredPosts[i].data.subreddit_name_prefixed)){
        //     continue;
        // }

        id: unfilteredPosts[i].data.name,
        subreddit: unfilteredPosts[i].data.subreddit_name_prefixed,
        title: unfilteredPosts[i].data.title,
        score: unfilteredPosts[i].data.score,
        created: unfilteredPosts[i].data.created,
        nsfw: unfilteredPosts[i].data.over_18,
        author: unfilteredPosts[i].data.author,
        media_only: unfilteredPosts[i].data.media_only,
        spoiler: unfilteredPosts[i].data.spoiler,
        is_text: unfilteredPosts[i].data.is_self,
        image: unfilteredPosts[i].data.url


      });
      lastID = unfilteredPosts[i].data.name;
    }

    this.setState({ posts: filteredPosts, lastPostID: lastID });
  };

  // will be called when user presses "load more posts button"
  fetchPosts = post_id => {
    var url;
    if (post_id === "init") {
      url = "https://www.reddit.com/r/all/top/.json?limit=25";
    } else {
      url = "https://www.reddit.com/r/all/top/.json?limit=25?after=" + post_id;
    }
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    // this.setState(xmlHttp.responseText);

    this.filterData(xmlHttp.responseText);
  };

  toggleNSFWHandler = () => {
    let showNSFW = this.state.showNSFW;
    console.log(showNSFW ? "SHOWING NSFW" : "NOT SHOWING NSFW");
    this.setState({ showNSFW: !showNSFW });
  };

  render() {
    return (
      <div className={classes.App}>
        <div className={classes.Title}>
          <h1>Lurker for Reddit</h1>
        </div>
        <Toolbar toggleNSFW={this.toggleNSFWHandler} />
        <div className={classes.Body}>
          <Posts posts={this.state.posts} />
        </div>
        <button
          className={classes.LoadMoreButton}
          onClick={() => this.fetchPosts(this.state.lastPostID)}
        >
          load more posts
        </button>
      </div>
    );
  }
}

export default App;
