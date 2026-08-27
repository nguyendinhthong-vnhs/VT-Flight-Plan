// Cơ sở dữ liệu địa danh sân bay
        const airports = [
            "VVTS - Tân Sơn Nhất Intl",
            "VVVT - Vũng Tàu",
            "VVCT - Cần Thơ Intl",
            "VVCM - Cà Mau",
            "VVRG - Rạch Giá",
            "VVPQ - Phú Quốc Intl",
            "VVCS - Côn Sơn",
            "VVTH - Tuy Hòa",
            "VVPC - Phù Cát",
            "VVDN - Đà Nẵng Intl",
            "VVCR - Cam Ranh Intl",
            "VVCA - Chu Lai",
            "VVPK - Pleiku",
            "VVDL - Liên Khương",
            "VVBM - Buôn Ma Thuột",
            "VVNB - Nội Bài Intl",
            "VVGL - Gia Lâm",
            "VVCI - Cát Bi Intl",
            "VVVD - Vân Đồn Intl",
            "VVVH - Vinh",
            "VVTX - Thọ Xuân",
            "VVPB - Phú Bài Intl",
            "VVDH - Đồng Hới",
            "VVDB - Điện Biên",
            "WMKE - Kerteh - Malay",
            "WMKN - Kuala Terengganu",
            "ZZZZ - Sân bay khác"
        ];
            
        // Cơ sở dữ liệu tọa độ sân bay
        const airportCoordinates = {
            "VVTS": {
                lat: 10.8205,
                lon: 106.6608
            }, // Tân Sơn Nhất Intl
            "VVVT": {
                lat: 10.3698,
                lon: 107.0962
            }, // Vũng Tàu
            "VVCT": {
                lat: 10.0838,
                lon: 105.7100
            }, // Cần Thơ Intl
            "VVCM": {
                lat: 9.1775,
                lon: 105.1762
            }, // Cà Mau
            "VVRG": {
                lat: 9.9587,
                lon: 105.1342
            }, // Rạch Giá
            "VVPQ": {
                lat: 10.1697,
                lon: 103.9930
            }, // Phú Quốc Intl
            "VVCS": {
                lat: 8.7330,
                lon: 106.6297
            }, // Côn Sơn
            "VVTH": {
                lat: 13.0422,
                lon: 109.3303
            }, // Tuy Hòa
            "VVPC": {
                lat: 13.9492,
                lon: 109.0462
            }, // Phù Cát
            "VVDN": {
                lat: 16.0438,
                lon: 108.2003
            }, // Đà Nẵng Intl
            "VVCR": {
                lat: 11.9955,
                lon: 109.2183
            }, // Cam Ranh Intl
            "VVCA": {
                lat: 15.4062,
                lon: 108.7058
            }, // Chu Lai
            "VVPK": {
                lat: 14.0045,
                lon: 108.0197
            }, // Pleiku
            "VVDL": {
                lat: 11.7533,
                lon: 108.3680
            }, // Liên Khương
            "VVBM": {
                lat: 12.6683,
                lon: 108.1167
            }, // Buôn Ma Thuột
            "VVNB": {
                lat: 21.2217,
                lon: 105.8055
            }, // Nội Bài Intl
            "VVGL": {
                lat: 21.0400,
                lon: 105.8867
            }, // Gia Lâm
            "VVCI": {
                lat: 20.8170,
                lon: 106.7230
            }, // Cát Bi Intl
            "VVVD": {
                lat: 21.1180,
                lon: 107.4142
            }, // Vân Đồn Intl
            "VVVH": {
                lat: 18.7300,
                lon: 105.6717
            }, // Vinh
            "VVTX": {
                lat: 19.9025,
                lon: 105.4692
            }, // Thọ Xuân
            "VVPB": {
                lat: 16.4007,
                lon: 107.7025
            }, // Phú Bài Intl
            "VVDH": {
                lat: 17.5153,
                lon: 106.5908
            }, // Đồng Hới
            "VVDB": {
                lat: 21.3995,
                lon: 103.0047
            } ,// Điện Biên
             "WMKE": {
                lat: 4.5383,
                lon: 103.4266
            }, // Kerteh - Malay
            "WMKN": {
                lat: 5.3811,
                lon: 103.1030
            } // Kuala Terengganu
        };