// Cơ sở dữ liệu Waypoint thuộc hàng không dân dụng
        const waypointDatabase = {
            // VOR
            "TRN": {
                lat: 10.0833,
                lon: 105.7056,
                type: "VOR",
                name: "Trà Nóc"
            },
            "VTV": {
                lat: 10.3728,
                lon: 107.0944,
                type: "VOR",
                name: "Vũng Tàu"
            },
            "PTH": {
                lat: 10.9281,
                lon: 108.0719,
                type: "VOR",
                name: "Phan Thiết"
            },
            "THX": {
                lat: 19.8847,
                lon: 105.4928,
                type: "VOR",
                name: "Thọ Xuân"
            },
            "PQU": {
                lat: 10.1697,
                lon: 103.9931,
                type: "VOR",
                name: "Phú Quốc"
            },
            "TUH": {
                lat: 13.0261,
                lon: 109.3211,
                type: "VOR",
                name: "Tuy Hòa"
            },
            "DOH": {
                lat: 17.5161,
                lon: 106.5933,
                type: "VOR",
                name: "Đồng Hới"
            },
            "DBN": {
                lat: 21.3736,
                lon: 103.0078,
                type: "VOR",
                name: "Điện Biên"
            },
            "VIN": {
                lat: 18.7342,
                lon: 105.6683,
                type: "VOR",
                name: "Vinh"
            },
            "PCA": {
                lat: 13.9572,
                lon: 109.0372,
                type: "VOR",
                name: "Phù Cát"
            },
            "NOB": {
                lat: 21.2131,
                lon: 105.8350,
                type: "VOR",
                name: "Nội Bài"
            },
            "VPH": {
                lat: 21.2761,
                lon: 105.6011,
                type: "VOR",
                name: "Phú Bài"
            },
            "NAH": {
                lat: 20.3872,
                lon: 106.1178,
                type: "VOR",
                name: "Nam Hà"
            },
            "CBI": {
                lat: 20.8156,
                lon: 106.7244,
                type: "VOR",
                name: "Cát Bi"
            },
            "PLK": {
                lat: 14.0061,
                lon: 108.0244,
                type: "VOR",
                name: "Pleiku"
            },
            "CLA": {
                lat: 15.4200,
                lon: 108.6911,
                type: "VOR",
                name: "Chu Lai"
            },
            "HUE": {
                lat: 16.4022,
                lon: 107.7017,
                type: "VOR",
                name: "Huế"
            },
            "DAN": {
                lat: 16.0528,
                lon: 108.1983,
                type: "VOR",
                name: "Đà Nẵng"
            },
            "TSH": {
                lat: 10.8183,
                lon: 106.6506,
                type: "VOR",
                name: "Tân Sơn"
            },
            "BMT": {
                lat: 12.6664,
                lon: 108.1231,
                type: "VOR",
                name: "Ban Mê"
            },
            "CRA": {
                lat: 11.9944,
                lon: 109.2200,
                type: "VOR",
                name: "Cam Ranh"
            },
            "VDO": {
                lat: 21.0733,
                lon: 107.3900,
                type: "VOR",
                name: "Vân Đồn"
            },
            "VKP": {
                lat: 4.5326,
                lon: 103.4301,
                type: "VOR",
                name: "Kerteh - Malay"
            },
            // NDB
            "CN": {
                lat: 8.7328,
                lon: 106.6264,
                type: "NDB",
                name: "Côn Đảo"
            },
            "QL": {
                lat: 9.1761,
                lon: 105.1767,
                type: "NDB",
                name: "Quản Long"
            },
            "AM": {
                lat: 20.9889,
                lon: 105.8614,
                type: "NDB",
                name: "Gia Lâm"
            },
            // Waypoint
            "ADBOP": {
                lat: 8.5000,
                lon: 104.0833,
                type: "WP"
            },
            "AGSAM": {
                lat: 11.4717,
                lon: 112.5883,
                type: "WP"
            },
            "AGSIS": {
                lat: 11.0219,
                lon: 108.8311,
                type: "WP"
            },
            "AKMON": {
                lat: 8.2150,
                lon: 110.2183,
                type: "WP"
            },
            "ALDAS": {
                lat: 10.9483,
                lon: 112.2050,
                type: "WP"
            },
            "ANHOA": {
                lat: 9.7872,
                lon: 105.9083,
                type: "WP"
            },
            "ANINA": {
                lat: 13.9833,
                lon: 107.4167,
                type: "WP"
            },
            "ANOKI": {
                lat: 12.3667,
                lon: 113.2500,
                type: "WP"
            },
            "ARESI": {
                lat: 13.9733,
                lon: 114.4500,
                type: "WP"
            },
            "ASEBO": {
                lat: 10.3317,
                lon: 107.2900,
                type: "WP"
            },
            "ASSAD": {
                lat: 18.3411,
                lon: 107.6814,
                type: "WP"
            },
            "ASUKU": {
                lat: 15.6072,
                lon: 109.2442,
                type: "WP"
            },
            "ATGAS": {
                lat: 10.4047,
                lon: 105.5172,
                type: "WP"
            },
            "ATVIT": {
                lat: 12.1389,
                lon: 109.4961,
                type: "WP"
            },
            "BALOV": {
                lat: 20.1297,
                lon: 107.7086,
                type: "WP"
            },
            "BANSU": {
                lat: 14.2861,
                lon: 108.1597,
                type: "WP"
            },
            "BESKI": {
                lat: 18.9486,
                lon: 106.1014,
                type: "WP"
            },
            "BIBAN": {
                lat: 8.5000,
                lon: 105.0000,
                type: "WP"
            },
            "BIGBO": {
                lat: 16.4886,
                lon: 107.6272,
                type: "WP"
            },
            "BINKU": {
                lat: 16.5597,
                lon: 108.9731,
                type: "WP"
            },
            "BISON": {
                lat: 20.4333,
                lon: 105.6417,
                type: "WP"
            },
            "BITIS": {
                lat: 10.2664,
                lon: 106.2483,
                type: "WP"
            },
            "BITOD": {
                lat: 7.2567,
                lon: 104.1183,
                type: "WP"
            },
            "BIVIM": {
                lat: 19.5094,
                lon: 106.1078,
                type: "WP"
            },
            "BODOD": {
                lat: 9.6394,
                lon: 106.8581,
                type: "WP"
            },
            "BOMPA": {
                lat: 14.3333,
                lon: 107.4000,
                type: "WP"
            },
            "BUKMA": {
                lat: 10.8472,
                lon: 107.0308,
                type: "WP"
            },
            "BUNTA": {
                lat: 16.8333,
                lon: 109.3950,
                type: "WP"
            },
            "BUVAN": {
                lat: 18.5564,
                lon: 106.5892,
                type: "WP"
            },
            "CAHEO": {
                lat: 16.5364,
                lon: 107.9653,
                type: "WP"
            },
            "CONDA": {
                lat: 8.9572,
                lon: 106.4747,
                type: "WP"
            },
            "DADEM": {
                lat: 10.8956,
                lon: 105.2281,
                type: "WP"
            },
            "DADEN": {
                lat: 13.9994,
                lon: 107.8436,
                type: "WP"
            },
            "DADIN": {
                lat: 20.8342,
                lon: 106.2231,
                type: "WP"
            },
            "DAGAG": {
                lat: 9.4633,
                lon: 108.4417,
                type: "WP"
            },
            "DAMEL": {
                lat: 13.9783,
                lon: 111.5100,
                type: "WP"
            },
            "DAMVO": {
                lat: 11.1083,
                lon: 109.5450,
                type: "WP"
            },
            "DENMO": {
                lat: 22.0417,
                lon: 106.4144,
                type: "WP"
            },
            "DILEN": {
                lat: 22.1097,
                lon: 105.4697,
                type: "WP"
            },
            "DONDA": {
                lat: 14.7033,
                lon: 112.0217,
                type: "WP"
            },
            "DONGI": {
                lat: 17.6814,
                lon: 106.5953,
                type: "WP"
            },
            "DONXO": {
                lat: 11.4233,
                lon: 106.9517,
                type: "WP"
            },
            "DOVIN": {
                lat: 11.9169,
                lon: 108.1081,
                type: "WP"
            },
            "DOXAR": {
                lat: 12.3667,
                lon: 110.3783,
                type: "WP"
            },
            "DUDIS": {
                lat: 7.0000,
                lon: 106.8100,
                type: "WP"
            },
            "EGEMU": {
                lat: 17.0000,
                lon: 112.2833,
                type: "WP"
            },
            "ELSAS": {
                lat: 10.1367,
                lon: 107.5483,
                type: "WP"
            },
            "ENGIM": {
                lat: 13.3406,
                lon: 108.1392,
                type: "WP"
            },
            "ENPAS": {
                lat: 10.3997,
                lon: 106.1114,
                type: "WP"
            },
            "ENRIN": {
                lat: 11.1853,
                lon: 107.3239,
                type: "WP"
            },
            "ESDOB": {
                lat: 10.8886,
                lon: 106.9639,
                type: "WP"
            },
            "ESPOB": {
                lat: 7.0000,
                lon: 105.5550,
                type: "WP"
            },
            "EXOTO": {
                lat: 15.3583,
                lon: 111.0500,
                type: "WP"
            },
            "GONLY": {
                lat: 13.6667,
                lon: 107.5000,
                type: "WP"
            },
            "HAMIN": {
                lat: 17.1297,
                lon: 107.6778,
                type: "WP"
            },
            "HATIN": {
                lat: 18.4669,
                lon: 107.0489,
                type: "WP"
            },
            "HUVAN": {
                lat: 21.2083,
                lon: 105.1114,
                type: "WP"
            },
            "IBUNU": {
                lat: 11.6689,
                lon: 108.8681,
                type: "WP"
            },
            "IDOTA": {
                lat: 18.6933,
                lon: 105.1394,
                type: "WP"
            },
            "IGARI": {
                lat: 6.9367,
                lon: 103.5850,
                type: "WP"
            },
            "IPRIX": {
                lat: 7.0000,
                lon: 104.1317,
                type: "WP"
            },
            "ITBAM": {
                lat: 16.6667,
                lon: 109.6017,
                type: "WP"
            },
            "KADIM": {
                lat: 18.6522,
                lon: 106.0978,
                type: "WP"
            },
            "KADUM": {
                lat: 11.3572,
                lon: 107.0594,
                type: "WP"
            },
            "KAMGO": {
                lat: 13.2875,
                lon: 109.1014,
                type: "WP"
            },
            "KAMSU": {
                lat: 18.2536,
                lon: 106.0933,
                type: "WP"
            },
            "KANGU": {
                lat: 16.3542,
                lon: 108.6647,
                type: "WP"
            },
            "KARAN": {
                lat: 12.6489,
                lon: 109.1567,
                type: "WP"
            },
            "KATBO": {
                lat: 23.3600,
                lon: 105.2917,
                type: "WP"
            },
            "KISAN": {
                lat: 10.5389,
                lon: 104.6750,
                type: "WP"
            },
            "KONCO": {
                lat: 17.0000,
                lon: 107.1869,
                type: "WP"
            },
            "KUMUN": {
                lat: 14.9714,
                lon: 108.8075,
                type: "WP"
            },
            "LADON": {
                lat: 21.1036,
                lon: 102.9669,
                type: "WP"
            },
            "LAOCAI": {
                lat: 22.4867,
                lon: 103.9653,
                type: "WP"
            },
            "LAPON": {
                lat: 20.7500,
                lon: 104.4750,
                type: "WP"
            },
            "LATOM": {
                lat: 14.8794,
                lon: 107.8436,
                type: "WP"
            },
            "LAVAN": {
                lat: 14.1750,
                lon: 105.6917,
                type: "WP"
            },
            "LAVOS": {
                lat: 20.4347,
                lon: 104.3972,
                type: "WP"
            },
            "LEDUP": {
                lat: 10.7758,
                lon: 107.1469,
                type: "WP"
            },
            "LITAM": {
                lat: 8.9936,
                lon: 106.7017,
                type: "WP"
            },
            "LOCHA": {
                lat: 20.6567,
                lon: 106.9536,
                type: "WP"
            },
            "LOSON": {
                lat: 10.4933,
                lon: 107.0756,
                type: "WP"
            },
            "LOVBI": {
                lat: 20.7428,
                lon: 105.9967,
                type: "WP"
            },
            "MAPNO": {
                lat: 10.2183,
                lon: 110.3350,
                type: "WP"
            },
            "MAREL": {
                lat: 19.2281,
                lon: 106.6936,
                type: "WP"
            },
            "MATGI": {
                lat: 10.8956,
                lon: 107.6467,
                type: "WP"
            },
            "MELAS": {
                lat: 7.0883,
                lon: 108.1533,
                type: "WP"
            },
            "MEOVA": {
                lat: 23.1150,
                lon: 105.3100,
                type: "WP"
            },
            "MESOX": {
                lat: 13.9800,
                lon: 113.0450,
                type: "WP"
            },
            "MEVON": {
                lat: 13.3364,
                lon: 108.0742,
                type: "WP"
            },
            "MIBAM": {
                lat: 18.9072,
                lon: 106.4119,
                type: "WP"
            },
            "MIGUG": {
                lat: 15.2733,
                lon: 114.0000,
                type: "WP"
            },
            "MIMUX": {
                lat: 11.3050,
                lon: 111.1033,
                type: "WP"
            },
            "MOXEB": {
                lat: 10.8994,
                lon: 106.4628,
                type: "WP"
            },
            "MOXON": {
                lat: 8.8250,
                lon: 109.3550,
                type: "WP"
            },
            "MUGAN": {
                lat: 12.3667,
                lon: 111.8717,
                type: "WP"
            },
            "MULAD": {
                lat: 12.5481,
                lon: 107.5747,
                type: "WP"
            },
            "MUMGA": {
                lat: 14.0000,
                lon: 108.1536,
                type: "WP"
            },
            "NAKHA": {
                lat: 21.9667,
                lon: 106.4933,
                type: "WP"
            },
            "NALAO": {
                lat: 19.3242,
                lon: 103.9264,
                type: "WP"
            },
            "NHATA": {
                lat: 12.2264,
                lon: 109.2011,
                type: "WP"
            },
            "NITOM": {
                lat: 12.7419,
                lon: 110.6403,
                type: "WP"
            },
            "NIVEN": {
                lat: 17.8844,
                lon: 106.9289,
                type: "WP"
            },
            "NIXIV": {
                lat: 9.3933,
                lon: 106.6339,
                type: "WP"
            },
            "NOBID": {
                lat: 13.3122,
                lon: 108.5819,
                type: "WP"
            },
            "NOBOK": {
                lat: 20.6222,
                lon: 102.6406,
                type: "WP"
            },
            "NOTHA": {
                lat: 20.5669,
                lon: 105.5456,
                type: "WP"
            },
            "NUMDI": {
                lat: 10.4453,
                lon: 103.7764,
                type: "WP"
            },
            "ONEBI": {
                lat: 11.9381,
                lon: 108.3086,
                type: "WP"
            },
            "OSIXA": {
                lat: 9.5222,
                lon: 109.8439,
                type: "WP"
            },
            "OSOTA": {
                lat: 10.5519,
                lon: 104.2636,
                type: "WP"
            },
            "PANDI": {
                lat: 11.6350,
                lon: 114.0000,
                type: "WP"
            },
            "PAPRA": {
                lat: 15.7667,
                lon: 107.1833,
                type: "WP"
            },
            "PATMA": {
                lat: 12.3364,
                lon: 107.8100,
                type: "WP"
            },
            "PATNO": {
                lat: 15.9650,
                lon: 107.8850,
                type: "WP"
            },
            "PHULU": {
                lat: 16.6947,
                lon: 107.8886,
                type: "WP"
            },
            "PHUTA": {
                lat: 20.9297,
                lon: 106.4606,
                type: "WP"
            },
            "POTIX": {
                lat: 10.2347,
                lon: 105.6167,
                type: "WP"
            },
            "RUNOP": {
                lat: 11.0881,
                lon: 106.6383,
                type: "WP"
            },
            "RUTIT": {
                lat: 10.4542,
                lon: 107.7575,
                type: "WP"
            },
            "SADAS": {
                lat: 13.3200,
                lon: 107.8294,
                type: "WP"
            },
            "SADIN": {
                lat: 15.0800,
                lon: 108.1772,
                type: "WP"
            },
            "SAMAP": {
                lat: 9.7883,
                lon: 109.2525,
                type: "WP"
            },
            "SAMOG": {
                lat: 8.0017,
                lon: 103.2400,
                type: "WP"
            },
            "SAPEN": {
                lat: 11.0194,
                lon: 106.1833,
                type: "WP"
            },
            "SATNO": {
                lat: 18.8783,
                lon: 106.6392,
                type: "WP"
            },
            "SOSPA": {
                lat: 11.8339,
                lon: 108.6408,
                type: "WP"
            },
            "SUDUN": {
                lat: 9.9928,
                lon: 108.7956,
                type: "WP"
            },
            "TANNA": {
                lat: 15.9033,
                lon: 107.6589,
                type: "WP"
            },
            "TATIM": {
                lat: 14.9806,
                lon: 108.0197,
                type: "WP"
            },
            "TEBAK": {
                lat: 22.1750,
                lon: 106.6750,
                type: "WP"
            },
            "TORED": {
                lat: 16.4636,
                lon: 106.6756,
                type: "WP"
            },
            "TRABE": {
                lat: 16.8958,
                lon: 107.4269,
                type: "WP"
            },
            "TULTU": {
                lat: 9.6831,
                lon: 106.8978,
                type: "WP"
            },
            "TUNPO": {
                lat: 10.0622,
                lon: 104.5894,
                type: "WP"
            },
            "UDOSI": {
                lat: 9.5469,
                lon: 111.1814,
                type: "WP"
            },
            "UPVAN": {
                lat: 20.9256,
                lon: 105.3919,
                type: "WP"
            },
            "VANUC": {
                lat: 20.5497,
                lon: 106.7217,
                type: "WP"
            },
            "VEPAM": {
                lat: 13.9667,
                lon: 110.0000,
                type: "WP"
            },
            "VEPKI": {
                lat: 9.1058,
                lon: 106.3736,
                type: "WP"
            },
            "VEPMA": {
                lat: 10.9333,
                lon: 107.6717,
                type: "WP"
            },
            "VETOM": {
                lat: 11.2331,
                lon: 107.6075,
                type: "WP"
            },
            "VIDAD": {
                lat: 18.8478,
                lon: 106.8717,
                type: "WP"
            },
            "VIDEN": {
                lat: 17.0206,
                lon: 107.3656,
                type: "WP"
            },
            "VIGEN": {
                lat: 7.9956,
                lon: 105.3694,
                type: "WP"
            },
            "VILAO": {
                lat: 17.3667,
                lon: 106.0833,
                type: "WP"
            },
            "VILOT": {
                lat: 15.0386,
                lon: 108.1117,
                type: "WP"
            },
            "VIMUT": {
                lat: 13.9625,
                lon: 109.5214,
                type: "WP"
            },
            "XAQUA": {
                lat: 14.9194,
                lon: 108.1017,
                type: "WP"
            },
            "XIVIN": {
                lat: 20.5761,
                lon: 105.5686,
                type: "WP"
            },
            "XOBAV": {
                lat: 10.1389,
                lon: 106.6425,
                type: "WP"
            },
            "XONAN": {
                lat: 9.2450,
                lon: 102.8383,
                type: "WP"
            },
            "XONUS": {
                lat: 18.0700,
                lon: 107.2331,
                type: "WP"
            },
            "ESANG": {
                lat: 12.9392,
                lon: 108.1031,
                type: "WP"
            },
            "HINTO": {
                lat: 12.9392,
                lon: 108.1297,
                type: "WP"
            },
            "MOLAN": {
                lat: 12.8869,
                lon: 108.2786,
                type: "WP"
            },
            "HOLAC": {
                lat: 12.4067,
                lon: 108.1894,
                type: "WP"
            },
            "VULIN": {
                lat: 12.3972,
                lon: 108.1178,
                type: "WP"
            },
            "KONAO": {
                lat: 12.4258,
                lon: 107.9928,
                type: "WP"
            },
            "TANGO": {
                lat: 12.4508,
                lon: 107.9517,
                type: "WP"
            },
            "XELEX": {
                lat: 12.9194,
                lon: 108.0119,
                type: "WP"
            },
            "ANRAN": {
                lat: 11.3500,
                lon: 107.0692,
                type: "WP"
            },
            "DOBLU": {
                lat: 12.8297,
                lon: 108.3386,
                type: "WP"
            },
            "NUMRO": {
                lat: 12.5056,
                lon: 107.8958,
                type: "WP"
            },
            "KEMSY": {
                lat: 15.5433,
                lon: 108.3958,
                type: "WP"
            },
            "HOKIN": {
                lat: 16.4511,
                lon: 108.5786,
                type: "WP"
            },
            "ANLUT": {
                lat: 15.5019,
                lon: 108.1864,
                type: "WP"
            },
            "TAHUA": {
                lat: 15.5039,
                lon: 108.1514,
                type: "WP"
            },
            "SAMBO": {
                lat: 16.2769,
                lon: 108.7069,
                type: "WP"
            },
            "IKUMI": {
                lat: 5.893833,
                lon: 103.919167,
                type: "WP"
            },
            "SUNRA": {
                lat: 15.3664,
                lon: 108.1833,
                type: "WP"
            },
            "MISIN": {
                lat: 15.3686,
                lon: 108.1397,
                type: "WP"
            },
            "LAIKA": {
                lat: 16.5867,
                lon: 108.1353,
                type: "WP"
            },
            "TAMKY": {
                lat: 15.6158,
                lon: 108.5442,
                type: "WP"
            },
            "SOTIN": {
                lat: 15.1417,
                lon: 108.7678,
                type: "WP"
            },
            "TASON": {
                lat: 15.1625,
                lon: 108.5831,
                type: "WP"
            },
            "MEXAX": {
                lat: 15.0033,
                lon: 108.5058,
                type: "WP"
            },
            "MUMLU": {
                lat: 15.6717,
                lon: 108.6506,
                type: "WP"
            },
            "DOTEN": {
                lat: 15.7672,
                lon: 108.1183,
                type: "WP"
            },
            "ESSEN": {
                lat: 15.6339,
                lon: 108.3817,
                type: "WP"
            },
            "HENTA": {
                lat: 15.2628,
                lon: 108.1069,
                type: "WP"
            },
            "HINTA": {
                lat: 16.1675,
                lon: 108.0486,
                type: "WP"
            },
            "KHUHO": {
                lat: 15.2544,
                lon: 108.0747,
                type: "WP"
            }

        };