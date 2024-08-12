import React from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { call_mediator2 } from '../../utils/mediator'
import { request_url } from '../../utils/config'
import styles from "./styles.module.css"

function Recorder({call_back_event}) {
    

    return (

            <AudioRecorder
            isRecording={false}
                onRecordingComplete={call_back_event}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                classes={styles}
                // downloadOnSavePress={true}
                downloadFileExtension="webm"
            />

    )
}

export default Recorder