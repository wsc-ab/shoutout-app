export const localizations = {
  en: {
    title: 'Channel',
    name: {title: 'Name', detail: 'Name of your channel.'},
    type: {
      title: 'Type',
      detail: 'Set it to prvite to not show moments on discovery.',
      options: [
        {name: 'public', title: 'Public'},
        {name: 'private', title: 'Private'},
      ],
    },
    media: {
      title: 'Media',
      detail: 'Set allowed media.',
      options: [
        {name: 'both', title: 'Both'},
        {name: 'image', title: 'Image'},
        {name: 'video', title: 'Video'},
      ],
    },
    mode: {
      title: 'Mode',
      detail:
        'Use camera mode to allow users to share moments taken from camera only.',
      options: [
        {name: 'both', title: 'Both'},
        {name: 'camera', title: 'Camera'},
        {name: 'library', title: 'Library'},
      ],
    },
    ghosting: {
      title: 'Block ghosting',
      detail:
        "Set the number of allowed ghosting days. If set to 7 days, users who haven't posted in the last 7 days can't access the channel.",
      options: [
        {name: 'off', title: 'Off'},
        {name: '1', title: '1 Day'},
        {name: '7', title: '7 Days'},
        {name: '14', title: '14 Days'},
      ],
    },
  },
  ko: {
    title: '채널',
    name: {title: '이름', detail: '채널의 이름을 적어주세요.'},
    type: {
      title: '종류',
      detail:
        '프라이빗 채널은 디스커버리 탭이나 검색에서 모멘트를 보여주지 않습니다.',
      options: [
        {name: 'public', title: '퍼블릭'},
        {name: 'private', title: '프라이빗'},
      ],
    },
    media: {
      title: '미디어',
      detail: '지원하는 미디어 종류를 선택하세요.',
      options: [
        {name: 'both', title: '모두'},
        {name: 'image', title: '이미지'},
        {name: 'video', title: '동영상'},
      ],
    },
    mode: {
      title: '모드',
      detail:
        '카메라 모드를 선택하면 카메라로 바로 찍은 라이브 모멘트만 올릴 수 있습니다.',
      options: [
        {name: 'both', title: '모두'},
        {name: 'camera', title: '카메라'},
        {name: 'library', title: '라이브러리'},
      ],
    },
    ghosting: {
      title: '눈팅 방지',
      detail:
        '눈팅 가능한 날짜를 적어주세요. 7일을 선택하면, 지난 7일 동안 한 번도 채널에 참여하지 않은 유저들은 채널 내용을 볼 수 없습니다.',
      options: [
        {name: 'off', title: '끄기'},
        {name: '1', title: '1일'},
        {name: '7', title: '7일'},
        {name: '14', title: '14일'},
      ],
    },
  },
};
