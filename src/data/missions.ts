export interface MissionEvent {
  year: string
  title: string
  detail: string
  status: 'past' | 'current' | 'future'
}

export const PLANET_MISSIONS: Record<string, MissionEvent[]> = {
  mercury: [
    { year: '1974', title: 'Mariner 10 Bay Qua', detail: 'Tàu vũ trụ đầu tiên bay qua Sao Thủy, lập bản đồ 45% bề mặt', status: 'past' },
    { year: '2011', title: 'MESSENGER Vào Quỹ Đạo', detail: 'Vào quỹ đạo, lập bản đồ toàn bộ hành tinh đến năm 2015', status: 'past' },
    { year: '2018', title: 'Phóng BepiColombo', detail: 'Sứ mệnh ESA/JAXA đang trên đường, dự kiến đến 2025', status: 'current' },
    { year: '2035', title: 'Đề Xuất Tàu Hạ Cánh', detail: 'Ý tưởng thu thập mẫu bề mặt đang được nghiên cứu', status: 'future' },
  ],
  venus: [
    { year: '1970', title: 'Hạ Cánh Venera 7', detail: 'Lần hạ cánh thành công đầu tiên lên một hành tinh khác', status: 'past' },
    { year: '1990', title: 'Magellan Lập Bản Đồ', detail: 'Quét radar 98% bề mặt cho đến năm 1994', status: 'past' },
    { year: '2021', title: 'VERITAS (Kế Hoạch)', detail: 'Sứ mệnh radar quỹ đạo độ phân giải cao của NASA', status: 'future' },
    { year: '2029', title: 'Hạ Độ Cao DAVINCI+', detail: 'Tàu thăm dò khí quyển và ý tưởng tàu hạ cánh', status: 'future' },
  ],
  earth: [
    { year: '1957', title: 'Kỷ Nguyên Sputnik', detail: 'Vệ tinh nhân tạo đầu tiên đánh dấu kỷ nguyên vũ trụ', status: 'past' },
    { year: '1969', title: 'Apollo 11', detail: 'Lần đầu tiên con người hạ cánh lên Mặt Trăng', status: 'past' },
    { year: '1998', title: 'Xây Dựng ISS', detail: 'Con người bắt đầu hiện diện liên tục trên quỹ đạo', status: 'past' },
    { year: '2026', title: 'Cổng Mặt Trăng', detail: 'Trạm quỹ đạo Mặt Trăng có người đang được lắp ráp', status: 'current' },
    { year: '2030s', title: 'Có Người Lên Sao Hỏa', detail: 'Sứ mệnh có người đầu tiên lên Sao Hỏa đang được lên kế hoạch', status: 'future' },
  ],
  mars: [
    { year: '1976', title: 'Hạ Cánh Viking 1', detail: 'Tàu hạ cánh Sao Hỏa thành công đầu tiên, thí nghiệm sinh học', status: 'past' },
    { year: '1997', title: 'Pathfinder / Sojourner', detail: 'Xe tự hành Sao Hỏa đầu tiên, chứng minh khả năng di chuyển', status: 'past' },
    { year: '2012', title: 'Hạ Cánh Curiosity', detail: 'Xe tự hành cỡ ô tô, vẫn đang hoạt động tại miệng núi lửa Gale', status: 'past' },
    { year: '2021', title: 'Perseverance + Ingenuity', detail: 'Xe tự hành với trực thăng trinh sát, thu thập mẫu', status: 'current' },
    { year: '2030', title: 'Thu Hồi Mẫu Sao Hỏa', detail: 'Sứ mệnh chung NASA/ESA thu hồi các mẫu đã lưu trữ', status: 'future' },
  ],
  jupiter: [
    { year: '1973', title: 'Pioneer 10 Bay Qua', detail: 'Tàu vũ trụ đầu tiên vượt qua vành đai tiểu hành tinh', status: 'past' },
    { year: '1979', title: 'Voyager 1 & 2', detail: 'Hình ảnh chi tiết Vết Đỏ Lớn và các mặt trăng Galile', status: 'past' },
    { year: '1995', title: 'Tàu Quỹ Đạo Galileo', detail: 'Nghiên cứu Sao Mộc cho đến khi vào khí quyển năm 2003', status: 'past' },
    { year: '2016', title: 'Juno Quỹ Đạo Cực', detail: 'Nghiên cứu từ trường và khí quyển', status: 'current' },
    { year: '2030s', title: 'Europa Clipper', detail: 'Trinh sát chi tiết mặt trăng băng Europa', status: 'future' },
  ],
  saturn: [
    { year: '1979', title: 'Pioneer 11 Bay Qua', detail: 'Tàu vũ trụ đầu tiên đến thăm Sao Thổ', status: 'past' },
    { year: '1981', title: 'Chạm Trán Voyager 2', detail: 'Hình ảnh độ phân giải cao về vành đai và mặt trăng', status: 'past' },
    { year: '2004', title: 'Cassini Đến Nơi', detail: 'Vào quỹ đạo, nghiên cứu Sao Thổ trong 13 năm', status: 'past' },
    { year: '2017', title: 'Hồi Kết Vĩ Đại', detail: 'Lao vào khí quyển Sao Thổ, kết thúc sứ mệnh', status: 'past' },
    { year: '2027', title: 'Dragonfly (Kế Hoạch)', detail: 'Drone hạt nhân khám phá Titan', status: 'future' },
  ],
  uranus: [
    { year: '1781', title: 'William Herschel', detail: 'Hành tinh đầu tiên được phát hiện bằng kính thiên văn', status: 'past' },
    { year: '1977', title: 'Phát Hiện Vành Đai', detail: 'Che khuất sao hé lộ hệ thống vành đai mờ', status: 'past' },
    { year: '1986', title: 'Voyager 2 Bay Qua', detail: 'Tàu vũ trụ duy nhất từng bay qua Sao Thiên Vương', status: 'past' },
    { year: '2032', title: 'Tàu Quỹ Đạo Thiên Vương (Ý Tưởng)', detail: 'Sứ mệnh hàng đầu được đề xuất đến các sao băng khổng lồ', status: 'future' },
  ],
  neptune: [
    { year: '1846', title: 'Ghi Chép Của Galileo', detail: 'Galileo đã quan sát Sao Hải Vương nhưng nhầm là một ngôi sao', status: 'past' },
    { year: '1989', title: 'Voyager 2 Bay Qua', detail: 'Phát hiện Vết Tối Lớn và 6 mặt trăng mới', status: 'past' },
    { year: '2024', title: 'JWST Quan Sát', detail: 'Kính viễn vọng Webb ghi nhận dữ liệu khí quyển Sao Hải Vương', status: 'current' },
    { year: '2040s', title: 'Tham Quan Sao Băng (Ý Tưởng)', detail: 'Sứ mệnh chung Sao Thiên Vương/Sao Hải Vương được đề xuất', status: 'future' },
  ],
}

export function getMissions(planetId: string): MissionEvent[] {
  return PLANET_MISSIONS[planetId] ?? []
}