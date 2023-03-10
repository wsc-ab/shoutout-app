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
      title: 'Ghosting',
      detail:
        "Set the number of allowed ghosting days. If set to 7 days, users who haven't posted in the last 7 days can't access the channel.",
      options: [
        {name: 'off', title: 'Off'},
        {name: '1', title: '1 Day'},
        {name: '7', title: '7 Days'},
        {name: '14', title: '14 Days'},
      ],
    },
    spam: {
      title: 'Spam',
      detail:
        'Set options for spam. If set to 6 hours, users can post only once every 6 hours.',
      options: [
        {name: 'off', title: 'Off'},
        {name: '1', title: '1 hour'},
        {name: '3', title: '3 hour'},
        {name: '6', title: '6 hour'},
        {name: '12', title: '12 hours'},
        {name: '24', title: '24 hours'},
      ],
    },
  },
  ko: {
    title: '채널',
    name: {title: '이름', detail: '채널의 이름을 적어주세요.'},
    type: {
      title: '종류',
      detail:
        '비공개 채널은 디스커버리 탭이나 검색에서 모멘트를 보여주지 않습니다.',
      options: [
        {name: 'public', title: '공개'},
        {name: 'private', title: '비공개'},
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
      title: '눈팅',
      detail:
        '눈팅 가능한 날짜를 선택하세요. 7일을 선택하면, 지난 7일 동안 채널에 참여하지 않은 유저들은 채널 내용을 볼 수 없습니다.',
      options: [
        {name: 'off', title: '끄기'},
        {name: '1', title: '1 일'},
        {name: '7', title: '7 일'},
        {name: '14', title: '14 일'},
      ],
    },
    spam: {
      title: '도배',
      detail:
        '도배 관련 옵션을 설정하세요. 6시간으로 설정시, 6시간에 한 번만 공유할 수 있습니다.',
      options: [
        {name: 'off', title: 'Off'},
        {name: '1', title: '1 시간'},
        {name: '3', title: '3 시간'},
        {name: '6', title: '6 시간'},
        {name: '12', title: '12 시간'},
        {name: '24', title: '24 시간'},
      ],
    },
  },
};
