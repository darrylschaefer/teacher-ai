import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import Console from "src/components/Console";
import promptOptions from "src/prompts.js";

const MediaStreamWrapper = ({ children }) => {
  const [userMediaStream, setUserMediaStream] = useState(null);

  useEffect(() => {
    // Initialize getUserMedia on component mount
    const initMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setUserMediaStream(stream);
    };

    initMediaStream();
  }, []);

  return children({ userMediaStream, setUserMediaStream });
};

export default function Home() {
  function introduction() {
    return {
      role: "assistant",
      content: "Please wait while the system initializes...",
    };
  }

  // textInput is the text input by the user in the console text input field
  const [textInput, setTextInput] = useState("");

  // audioRefs is an array of refs to the audio elements that are used to play audio samples, it's filled with nulls to prevent errors
  const audioRefs = useRef(Array(512).fill(null));

  // sessionMessages is an array of objects that contain the messages that are displayed in the console and sent to the chatGPT API
  const sessionMessages = useRef([introduction()]);

  // detecitonSettings is an object that contains the settings for the detection of the user's voice. activityDetection is a boolean that is true if the user has the setting enabled. activityDetectionThreshold is a number that is the threshold for the detection of the user's voice
  const detectionSettings = useRef({
    activityDetection: true,
    activityDetectionThreshold: 10,
  });

  // promptOpen determines whether the prompt edit box is open
  const [promptOpen, setPromptOpen] = useState(false);

  // activityDetection stores state for the microphone & it's associated color change, 0 = no activity, 1 = ready to record, 2- = recording, 4 - disabled
  const [activityDetection, setActivityDetection] = useState(0);

  // playQueue controls playing audio samples
  const [playQueue, setPlayQueue] = useState([]);

  // Used for detection of the last audio sample produced by AI, removed when it finishes playing
  const [currentAIAudio, setCurrentAIAudio] = useState(null);

  const [currentAudio, setCurrentAudio] = useState(null);

  // currentSession is a ref to the current session, used to stop the session when the user abandons it
  const currentSession = useRef(null);

  // micQuiet is the delay in milliseconds before the microphone is considered to be quiet
  const micQuiet = useRef(3000);

  // basic rerender state, used to force rerendering of components
  const [rerender, setRerender] = useState(0);

  // This is a stored prompt that is used to generate new sessions
  const selectedPrompt = useRef([
    promptOptions[0].prompt,
    promptOptions[0].asst,
  ]);

  function resetPlaceholderPrompt() {
    let placeholder;
    //scan promptOptions for the current prompt by matching it to selectedPrompt
    for (let i = 0; i < promptOptions.length; i++) {
      if (promptOptions[i].prompt == selectedPrompt.current[0]) {
        placeholder = promptOptions[i].label;
        if (placeholder == "Custom") {
          placeholder = "You're currently set to a custom prompt.";
        } else {
          placeholder =
            "You're currently set to the " +
            placeholder +
            " prompt. (" +
            promptOptions[i].desc +
            ")";
        }
      }
    }

    sessionMessages.current = [
      {
        role: "assistant",
        content:
          "Welcome to Teacher-AI! To adjust your voice settings and change your prompt, click the Settings menu below the console. " +
          placeholder,
      },
      {
        role: "assistant",
        content: selectedPrompt.current[1],
      },
    ];
    setRerender(rerender + 1);
  }

  useEffect(() => {
    fetch("/api/credentials").then((response) => {
      response.json().then((data) => {
        if (data.messages.length > 0) {
          sessionMessages.current = [introduction, ...data.messages];
          setRerender(rerender + 1);
        } else {
          resetPlaceholderPrompt();
        }
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Teacher-AI</title>
        <meta
          name="description"
          content="Teacher-AI is a V2AI2V conversational assistant that uses Chat-GPT to generate responses to user voice input."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <MediaStreamWrapper>
            {({ userMediaStream, setUserMediaStream }) => (
              <>
                <Console
                  selectedPrompt={selectedPrompt}
                  rerender={rerender}
                  setRerender={setRerender}
                  sessionMessages={sessionMessages}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  detectionSettings={detectionSettings}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                  activityDetection={activityDetection}
                  setActivityDetection={setActivityDetection}
                  currentAIAudio={currentAIAudio}
                  setCurrentAIAudio={setCurrentAIAudio}
                  playQueue={playQueue}
                  setPlayQueue={setPlayQueue}
                  audioRefs={audioRefs}
                  userMediaStream={userMediaStream}
                  currentSession={currentSession}
                  promptOpen={promptOpen}
                  setPromptOpen={setPromptOpen}
                  micQuiet={micQuiet}
                  resetPlaceholderPrompt={resetPlaceholderPrompt}
                ></Console>
              </>
            )}
          </MediaStreamWrapper>
        </div>
      </main>
    </>
  );
}
