import React from "react";
import Layout from "@theme/Layout";
import {
  LinkButtonGithub,
  LinkButtonYoutube,
} from "@site/src/components/link-button";

import imgHandMenu from "./hand-menu.jpg";
import imgMinimapSearch from "./minimap-search.jpg";
import imgMinimap from "./minimap.jpg";
import imgNewItem from "./new-item.jpg";

const ARInventory = () => {
  return (
    <Layout title="AR Inventory">
      <div className="container margin-vert--lg">
        <h1>AR Inventory</h1>

        <h4 className="text--subtlest">2022</h4>

        <div className="inline-flex gap--sm margin-bottom--md">
          <LinkButtonGithub href="https://github.com/jackdaus/AR-Inventory">
            GitHub
          </LinkButtonGithub>
          <LinkButtonYoutube href="https://www.youtube.com/watch?v=_x93WXU-CRo">
            YouTube
          </LinkButtonYoutube>
        </div>

        <div className="row">
          <div className="col col--7">
            <p>
              <b>AR Inventory</b> was an augmented reality inventory system
              prototype. The idea was to create a system where a user could
              virtually label real-world locations, then later search and
              navigate to these labels.
            </p>
            <p>
              The system takes advantage of the Meta Quest's spatial anchoring
              system to ensure that the inventory items are consistently
              word-locked to real-world locations across distinct user sessions.
            </p>
            <p>
              The app was built using{" "}
              <a href="https://stereokit.net/">StereoKit</a> — an easy-to-use
              open source mixed reality library for building XR applications
              with C#.
            </p>
          </div>
          <div className="col col--5">
            <div className="row">
              <div className="col">
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    maxWidth: "100%",
                    background: "#000",
                  }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/_x93WXU-CRo"
                    title="AR Inventory - GMU CS 452 - Fall 2022 (WIP)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col col--6">
            <img src={imgHandMenu} alt="hand menu" />
          </div>
          <div className="col col--6">
            <img src={imgMinimap} alt="minimap" />
          </div>
          <div className="col col--6">
            <img src={imgMinimapSearch} alt="minimap search" />
          </div>
          <div className="col col--6">
            <img src={imgNewItem} alt="new item" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ARInventory;
