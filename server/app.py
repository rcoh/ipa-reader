#!/usr/bin/python
# -*- coding: utf-8 -*-
import boto3
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
polly = boto3.client('polly', region_name='us-east-1')

def audio_for_ipa(ipa):

    response = polly.synthesize_speech(
        OutputFormat='mp3',
        Text=u'<phoneme alphabet="ipa" ph="{}"> </phoneme>'.format(ipa),
        TextType='ssml',
        VoiceId='Joanna'
    )
    return get_audio(response['AudioStream'])

def get_audio(audio_stream):
    data = audio_stream.read()
    while data:
        yield data
        data = audio_stream.read()


@app.route("/status")
def status():
    return jsonify({'status': 'OK'})

@app.route("/audio", methods=['POST'])
def audio():
    """Expects a POST {'ipa': 'pərpəl'}"""
    ipa = request.get_json()['ipa']
    if len(ipa) > 100:
        return jsonify({'error': 'IPA too long'}), 400
    return Response(audio_for_ipa(ipa), 'audio/mpeg'), 200


if __name__ == "__main__":
    app.run(host='127.0.0.1', port='80', debug=False)





