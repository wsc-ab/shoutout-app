export const localizations = {
  en: {
    needToJoin: {
      title: 'Need to join',
      message: 'First join this channel to share your contents!',
    },
    private: 'Private',
    public: 'Public',
    image: 'Image',
    video: 'Video',
    imageVideo: 'Image & Video',
    camera: 'Camera',
    anonymous: 'Anonymous',
    library: 'Library',

    ghosting: 'Ghosting',
    spam: 'Spam',

    spamAlert: (date: Date) => ({
      title: 'Please wait',
      message: `This channel has enabled the spam blocking. You can post from ${date.toLocaleString()}.`,
    }),
    nocontents: 'No contents in this channel.',
    ghostAlert: {
      title: 'Please share a content',
      message: 'You have been ghosting for too long.',
    },
  },
  ko: {
    needToJoin: {
      title: '채널에 조인 필요',
      message: '우선 채널에 조인해주세요!',
    },
    private: '비공개',

    public: '공개',

    image: '이미지',
    video: '비디오',
    imageVideo: '이미지 & 비디오',
    camera: '카메라',
    library: '라이브러리',
    anonymous: '익명',
    ghosting: '눈팅',
    spam: '도배',
    nocontents: '아직 콘텐츠가 없습니다.',
    ghostAlert: {
      title: '콘텐츠를 공유하세요',
      message: '너무 오래 눈팅하셨어요.',
    },
    spamAlert: (date: Date) => ({
      title: '조금 더 기다리세요',
      message: `이 채널은 스팸 방지 기능을 사용 중 입니다. ${date.toLocaleString()}에 포스팅 할 수 있습니다.`,
    }),
  },
};
