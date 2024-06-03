import React, { useEffect } from 'react';

/**
 * Video component used in ParticipantCApage, ParticipantVRSdialPage, StudyVRSCall pages
 * @param videoType - 'self-view' | 'remote-view' - Label of what type of video the component is
 * @param videoRef - Pass video object to component
 * @returns Video component for camera usage in ACE OMNI
 */
function ADSVideoComponent(props: { videoType: any, videoRef: any }) {
  const { videoType, videoRef } = props;
  useEffect(() => {
    // Put any functions we want to run when the component loads here
  }, []);

  if (videoType === 'self-view') {
    return (
      <video
        style={{ outline: 'black solid 2px' }}
        className="self-view-video"
        ref={videoRef}
        autoPlay
      >
        <track kind="captions" />
      </video>
    );
  }
  return (
    <video
      style={{ outline: 'black solid 2px' }}
      className="remote-view-video"
      ref={videoRef}
      autoPlay
    >
      <track kind="captions" />
    </video>
  );
}

export default ADSVideoComponent;
