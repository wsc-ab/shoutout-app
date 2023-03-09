export const localizations = {
  en: {
    needToJoin: {
      title: 'Need to join',
      message: 'First join this channel to share your contents!',
    },
    private: 'Private',
    privateModal:
      "Contents in this channel won't be shown on the discovery tab.",
    public: 'Public',
    publicModal: 'contents in this channel will be shown on the discovery tab.',
    image: 'Image',
    video: 'Video',
    imageVideo: 'Image & Video',
    camera: 'Camera',
    cameraModal:
      'This channel only allows contents taken from camera to be shared.',
    library: 'Library',
    libraryModal:
      'This channel only allows contents from media library to be uploaded.',
    ghosting: 'Ghosting',
    ghostingModal: (days: number) =>
      `This channel shows contents to users who have shared in the last ${days} days.`,
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
    private: '프라이빗',
    privateModal: '이 채널의 콘텐츠는 디스커버리나 검색에서 보이지 않습니다.',
    public: '퍼블릭',
    publicModal: '이 채널의 콘텐츠는 디스커버리나 검색에서 보입니다.',
    image: '이미지',
    video: '비디오',
    imageVideo: '이미지 & 비디오',
    camera: '카메라',
    cameraModal: '카메라에서 바로 찍은 콘텐츠만 공유할 수 있습니다.',
    library: '라이브러리',
    libraryModal: '라이브러리 콘텐츠만 올릴 수 있습니다.',
    ghosting: '눈팅',
    ghostingModal: (days: number) =>
      `이 채널은 지난 ${days} 일 중 활동한 유저에게만 콘텐츠가 보입니다.`,
    nocontents: '아직 콘텐츠가 없습니다.',
    ghostAlert: {
      title: '콘텐츠를 공유하세요',
      message: '너무 오래 눈팅하셨어요.',
    },
  },
};
