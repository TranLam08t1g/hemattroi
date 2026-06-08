export interface MoonData {
  id: string
  name: string
  parentId: string
  radius: number
  orbitRadius: number
  speed: number
  color: string
  hexColor: number
  startAngle: number
  type: 'rocky' | 'ice'
  description: string
  funFact?: string
}

export const MOONS: MoonData[] = [
  {
    id: 'moon',
    name: 'Mặt Trăng',
    parentId: 'earth',
    radius: 0.12,
    orbitRadius: 1.1,
    speed: 0.08,
    color: '#b8b8b8',
    hexColor: 0xb8b8b8,
    startAngle: 0,
    type: 'rocky',
    description:
      'Vệ tinh tự nhiên duy nhất của Trái Đất, Mặt Trăng là thiên thể sáng thứ hai trên bầu trời của chúng ta sau Mặt Trời. Bề mặt đầy những hố va chạm và biển dung nham cổ đại, minh chứng cho lịch sử bạo lực của hệ Mặt Trời thuở sơ khai.',
    funFact:
      'Mặt Trăng đang di chuyển ra xa Trái Đất khoảng 3.8cm mỗi năm.',
  },
  {
    id: 'phobos',
    name: 'Phobos',
    parentId: 'mars',
    radius: 0.05,
    orbitRadius: 0.85,
    speed: 0.14,
    color: '#8a745c',
    hexColor: 0x8a745c,
    startAngle: 1.2,
    type: 'rocky',
    description:
      'Vệ tinh lớn hơn và gần hơn của Sao Hoả, Phobos có quỹ đạo suy giảm dần và dự kiến sẽ va vào Sao Hoả hoặc vỡ thành vành đai trong khoảng 50 triệu năm tới.',
    funFact:
      'Phobos quay quanh Sao Hoả nhanh hơn chính Sao Hoả tự quay — nó mọc ở hướng Tây và lặn ở hướng Đông.',
  },
  {
    id: 'deimos',
    name: 'Deimos',
    parentId: 'mars',
    radius: 0.035,
    orbitRadius: 1.15,
    speed: 0.06,
    color: '#9a8a7a',
    hexColor: 0x9a8a7a,
    startAngle: 3.8,
    type: 'rocky',
    description:
      'Vệ tinh nhỏ xíu của Sao Hoả, Deimos có bề mặt tương đối mịn hơn Phobos do bụi regolith lấp đầy các hố va chạm của nó.',
    funFact:
      'Deimos chỉ nặng khoảng 1.5 tỷ tấn — tương đương khối lượng của một tiểu hành tinh nhỏ.',
  },
  {
    id: 'io',
    name: 'Io',
    parentId: 'jupiter',
    radius: 0.07,
    orbitRadius: 1.9,
    speed: 0.09,
    color: '#e8d070',
    hexColor: 0xe8d070,
    startAngle: 0,
    type: 'rocky',
    description:
      'Mặt trăng núi lửa nhất trong hệ Mặt Trời với hơn 400 núi lửa đang hoạt động. Lực thủy triều khổng lồ từ Sao Mộc liên tục làm tan chảy lõi của nó.',
    funFact:
      'Io phun trào lưu huỳnh nóng chảy lên độ cao tới 500km, nóng gấp đôi dung nham trên Trái Đất.',
  },
  {
    id: 'europa',
    name: 'Europa',
    parentId: 'jupiter',
    radius: 0.06,
    orbitRadius: 2.4,
    speed: 0.06,
    color: '#c0d4e0',
    hexColor: 0xc0d4e0,
    startAngle: 1.5,
    type: 'ice',
    description:
      'Một trong những ứng cử viên hàng đầu cho sự sống ngoài Trái Đất. Europa ẩn giấu một đại dương nước mặn khổng lồ bên dưới lớp băng dày hàng km.',
    funFact:
      'Đại dương ngầm của Europa ước tính chứa lượng nước gấp đôi tất cả các đại dương trên Trái Đất cộng lại.',
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    parentId: 'jupiter',
    radius: 0.08,
    orbitRadius: 2.9,
    speed: 0.045,
    color: '#888888',
    hexColor: 0x888888,
    startAngle: 3.0,
    type: 'ice',
    description:
      'Mặt trăng lớn nhất trong hệ Mặt Trời, Ganymede thậm chí còn lớn hơn Sao Thủy. Nó sở hữu từ trường riêng và có thể có đại dương ngầm nhiều tầng.',
    funFact:
      'Ganymede là mặt trăng duy nhất trong hệ Mặt Trời có từ trường riêng của nó.',
  },
  {
    id: 'callisto',
    name: 'Callisto',
    parentId: 'jupiter',
    radius: 0.07,
    orbitRadius: 3.4,
    speed: 0.035,
    color: '#505050',
    hexColor: 0x505050,
    startAngle: 4.5,
    type: 'rocky',
    description:
      'Mặt trăng bị va chạm nhiều nhất trong hệ Mặt Trời, Callisto có bề mặt cổ đại gần như không thay đổi trong hàng tỷ năm.',
    funFact:
      'Bề mặt Callisto có niên đại khoảng 4 tỷ năm, già gần bằng chính hệ Mặt Trời.',
  },
  {
    id: 'titan',
    name: 'Titan',
    parentId: 'saturn',
    radius: 0.08,
    orbitRadius: 2.1,
    speed: 0.055,
    color: '#d8b870',
    hexColor: 0xd8b870,
    startAngle: 0,
    type: 'ice',
    description:
      'Mặt trăng lớn nhất của Sao Thổ và là mặt trăng duy nhất trong hệ Mặt Trời có khí quyển dày đặc. Titan có hồ methane lỏng và chu trình thời tiết phức tạp.',
    funFact:
      'Trên Titan có mưa methane và các hồ hydrocarbon lỏng — nơi duy nhất ngoài Trái Đất có chất lỏng ổn định trên bề mặt.',
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    parentId: 'saturn',
    radius: 0.035,
    orbitRadius: 1.5,
    speed: 0.08,
    color: '#d0e8f4',
    hexColor: 0xd0e8f4,
    startAngle: 2.2,
    type: 'ice',
    description:
      'Mặt trăng băng giá nhỏ bé phun những tia nước khổng lồ vào không gian từ một đại dương ngầm toàn cầu bên dưới lớp vỏ băng dày.',
    funFact:
      'Các tia nước của Enceladus phun cao hàng trăm km và cung cấp vật chất cho vành đai E của Sao Thổ.',
  },
  {
    id: 'mimas',
    name: 'Mimas',
    parentId: 'saturn',
    radius: 0.03,
    orbitRadius: 1.25,
    speed: 0.1,
    color: '#b0b0a0',
    hexColor: 0xb0b0a0,
    startAngle: 4.0,
    type: 'rocky',
    description:
      'Mặt trăng nhỏ của Sao Thổ nổi tiếng với hố va chạm khổng lồ khiến nó trông giống như Ngôi Sao Chết trong Star Wars.',
    funFact:
      'Hố va chạm Herschel trên Mimas rộng 130km — bằng một phần ba đường kính của chính mặt trăng này.',
  },
  {
    id: 'miranda',
    name: 'Miranda',
    parentId: 'uranus',
    radius: 0.04,
    orbitRadius: 1.2,
    speed: 0.07,
    color: '#788890',
    hexColor: 0x788890,
    startAngle: 0.8,
    type: 'ice',
    description:
      'Mặt trăng kỳ lạ của Sao Thiên Vương với địa hình hỗn độn gồm những vách đá khổng lồ, hẻm núi sâu và bề mặt như được ghép từ nhiều mảnh.',
    funFact:
      'Vách đá Verona Rupes trên Miranda cao tới 20km — vách đá cao nhất trong toàn bộ hệ Mặt Trời.',
  },
  {
    id: 'titania',
    name: 'Titania',
    parentId: 'uranus',
    radius: 0.06,
    orbitRadius: 1.7,
    speed: 0.045,
    color: '#687888',
    hexColor: 0x687888,
    startAngle: 3.5,
    type: 'ice',
    description:
      'Mặt trăng lớn nhất của Sao Thiên Vương với bề mặt pha trộn giữa những hố va chạm cổ và các hệ thống hẻm núi khổng lồ.',
    funFact:
      'Titania có thể có một lớp nước lỏng mỏng giữa lõi đá và lớp vỏ băng.',
  },
  {
    id: 'triton',
    name: 'Triton',
    parentId: 'neptune',
    radius: 0.06,
    orbitRadius: 1.35,
    speed: 0.055,
    color: '#9aaab8',
    hexColor: 0x9aaab8,
    startAngle: 1.0,
    type: 'ice',
    description:
      'Mặt trăng lớn nhất của Sao Hải Vương với quỹ đạo nghịch hành độc đáo. Triton có hoạt động địa chất với các mạch phun nitrogen trên bề mặt băng giá.',
    funFact:
      'Triton là một trong những nơi lạnh nhất trong hệ Mặt Trời với nhiệt độ bề mặt khoảng -235°C.',
  },
]

export function getMoonsForPlanet(planetId: string): MoonData[] {
  return MOONS.filter((m) => m.parentId === planetId)
}