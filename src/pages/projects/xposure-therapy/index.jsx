import React from "react";
import Layout from "@theme/Layout";
import {
  LinkButtonGithub,
  LinkButtonYoutube,
} from "@site/src/components/link-button";

export default function Hello() {
  return (
    <Layout title="Xposure therapy">
      <div className="container margin-vert--lg">
        <h1>Xposure Therapy</h1>

				<h4 className="text--subtlest">2022</h4>

        <div className="inline-flex gap--sm margin-bottom--md">
          <LinkButtonGithub href="https://github.com/jackdaus/Xposure">
            GitHub
          </LinkButtonGithub>
          <LinkButtonYoutube href="https://youtu.be/GgPz8Zy8L2Ae">
            YouTube
          </LinkButtonYoutube>
        </div>

        <div className="row">
          <div className="col ">
            <p>
              This prototype illustrates how augmented reality can be used to
              treat phobias via exposure therapy. The idea of the app is to
              allow patients to gradually progress through increasingly intense
              exposures. With the guidance of a therapist, the patient can
              unlearn the fear associated with their phobia.
            </p>
            <p>
              The project was completed as part of{" "}
              <a href="https://devpost.com/software/xposure-therapy">
                Mixed Reality Dev Days 2022 - Microsoft Hackathon
              </a>
              . <b>Our team won second place!</b>
            </p>
            <p>
              The app was built using{" "}
              <a href="https://stereokit.net/">StereoKit</a> — an easy-to-use
              open source mixed reality library for building XR applications
              with C#.
            </p>
          </div>
          <div className="col">
            <iframe
              width="384"
              height="256"
              src="https://www.youtube.com/embed/GgPz8Zy8L2A?si=ggTA9GqCP1RGYUuC"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div className="flex"></div>
        </div>
      </div>
    </Layout>
  );
}
