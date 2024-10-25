const sp500Tickers = [
  { ticker: "MMM", name: "3M Company" },
  { ticker: "AOS", name: "A.O. Smith Corporation" },
  { ticker: "ABT", name: "Abbott Laboratories" },
  { ticker: "ABBV", name: "AbbVie Inc." },
  { ticker: "ACN", name: "Accenture plc" },
  { ticker: "ADBE", name: "Adobe Inc." },
  { ticker: "AMD", name: "Advanced Micro Devices, Inc." },
  { ticker: "AES", name: "The AES Corporation" },
  { ticker: "AFL", name: "AFLAC Incorporated" },
  { ticker: "A", name: "Agilent Technologies, Inc." },
  { ticker: "APD", name: "Air Products and Chemicals, Inc" },
  { ticker: "ABNB", name: "Airbnb, Inc." },
  { ticker: "AKAM", name: "Akamai Technologies, Inc." },
  { ticker: "ALB", name: "Albemarle Corporation" },
  { ticker: "ARE", name: "Alexandria Real Estate Equities" },
  { ticker: "ALGN", name: "Align Technology, Inc." },
  { ticker: "ALLE", name: "Allegion plc" },
  { ticker: "LNT", name: "Alliant Energy Corporation" },
  { ticker: "ALL", name: "Allstate Corporation (The)" },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "GOOG", name: "Alphabet Inc." },
  { ticker: "MO", name: "Altria Group, Inc." },
  { ticker: "AMZN", name: "Amazon.com, Inc." },
  { ticker: "AMCR", name: "Amcor plc" },
  { ticker: "AMTM", name: "Amentum Holdings, Inc." },
  { ticker: "AEE", name: "Ameren Corporation" },
  { ticker: "AEP", name: "American Electric Power Company" },
  { ticker: "AXP", name: "American Express Company" },
  { ticker: "AIG", name: "American International Group, I" },
  { ticker: "AMT", name: "American Tower Corporation (REI" },
  { ticker: "AWK", name: "American Water Works Company, I" },
  { ticker: "AMP", name: "Ameriprise Financial, Inc." },
  { ticker: "AME", name: "AMETEK, Inc." },
  { ticker: "AMGN", name: "Amgen Inc." },
  { ticker: "APH", name: "Amphenol Corporation" },
  { ticker: "ADI", name: "Analog Devices, Inc." },
  { ticker: "ANSS", name: "ANSYS, Inc." },
  { ticker: "AON", name: "Aon plc" },
  { ticker: "APA", name: "APA Corporation" },
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "AMAT", name: "Applied Materials, Inc." },
  { ticker: "APTV", name: "Aptiv PLC" },
  { ticker: "ACGL", name: "Arch Capital Group Ltd." },
  { ticker: "ADM", name: "Archer-Daniels-Midland Company" },
  { ticker: "ANET", name: "Arista Networks, Inc." },
  { ticker: "AJG", name: "Arthur J. Gallagher & Co." },
  { ticker: "AIZ", name: "Assurant, Inc." },
  { ticker: "T", name: "AT&T Inc." },
  { ticker: "ATO", name: "Atmos Energy Corporation" },
  { ticker: "ADSK", name: "Autodesk, Inc." },
  { ticker: "ADP", name: "Automatic Data Processing, Inc." },
  { ticker: "AZO", name: "AutoZone, Inc." },
  { ticker: "AVB", name: "AvalonBay Communities, Inc." },
  { ticker: "AVY", name: "Avery Dennison Corporation" },
  { ticker: "AXON", name: "Axon Enterprise, Inc." },
  { ticker: "BKR", name: "Baker Hughes Company" },
  { ticker: "BALL", name: "Ball Corporation" },
  { ticker: "BAC", name: "Bank of America Corporation" },
  { ticker: "BAX", name: "Baxter International Inc." },
  { ticker: "BDX", name: "Becton, Dickinson and Company" },
  { ticker: "BRK-B", name: "Berkshire Hathaway Inc. New" },
  { ticker: "BBY", name: "Best Buy Co., Inc." },
  { ticker: "TECH", name: "Bio-Techne Corp" },
  { ticker: "BIIB", name: "Biogen Inc." },
  { ticker: "BLK", name: "BlackRock, Inc." },
  { ticker: "BX", name: "Blackstone Inc." },
  { ticker: "BK", name: "The Bank of New York Mellon Cor" },
  { ticker: "BA", name: "Boeing Company (The)" },
  { ticker: "BKNG", name: "Booking Holdings Inc. Common St" },
  { ticker: "BWA", name: "BorgWarner Inc." },
  { ticker: "BSX", name: "Boston Scientific Corporation" },
  { ticker: "BMY", name: "Bristol-Myers Squibb Company" },
  { ticker: "AVGO", name: "Broadcom Inc." },
  { ticker: "BR", name: "Broadridge Financial Solutions," },
  { ticker: "BRO", name: "Brown & Brown, Inc." },
  { ticker: "BF-B", name: "Brown Forman Inc" },
  { ticker: "BLDR", name: "Builders FirstSource, Inc." },
  { ticker: "BG", name: "Bunge Limited" },
  { ticker: "BXP", name: "BXP, Inc." },
  { ticker: "CHRW", name: "C.H. Robinson Worldwide, Inc." },
  { ticker: "CDNS", name: "Cadence Design Systems, Inc." },
  { ticker: "CZR", name: "Caesars Entertainment, Inc." },
  { ticker: "CPT", name: "Camden Property Trust" },
  { ticker: "CPB", name: "Campbell Soup Company" },
  { ticker: "COF", name: "Capital One Financial Corporati" },
  { ticker: "CAH", name: "Cardinal Health, Inc." },
  { ticker: "KMX", name: "CarMax Inc" },
  { ticker: "CCL", name: "Carnival Corporation" },
  { ticker: "CARR", name: "Carrier Global Corporation" },
  { ticker: "CTLT", name: "Catalent, Inc." },
  { ticker: "CAT", name: "Caterpillar, Inc." },
  { ticker: "CBOE", name: "Cboe Global Markets, Inc." },
  { ticker: "CBRE", name: "CBRE Group Inc" },
  { ticker: "CDW", name: "CDW Corporation" },
  { ticker: "CE", name: "Celanese Corporation" },
  { ticker: "COR", name: "Cencora, Inc." },
  { ticker: "CNC", name: "Centene Corporation" },
  { ticker: "CNP", name: "CenterPoint Energy, Inc (Holdin" },
  { ticker: "CF", name: "CF Industries Holdings, Inc." },
  { ticker: "CRL", name: "Charles River Laboratories Inte" },
  { ticker: "SCHW", name: "Charles Schwab Corporation (The" },
  { ticker: "CHTR", name: "Charter Communications, Inc." },
  { ticker: "CVX", name: "Chevron Corporation" },
  { ticker: "CMG", name: "Chipotle Mexican Grill, Inc." },
  { ticker: "CB", name: "Chubb Limited" },
  { ticker: "CHD", name: "Church & Dwight Company, Inc." },
  { ticker: "CI", name: "The Cigna Group" },
  { ticker: "CINF", name: "Cincinnati Financial Corporatio" },
  { ticker: "CTAS", name: "Cintas Corporation" },
  { ticker: "CSCO", name: "Cisco Systems, Inc." },
  { ticker: "C", name: "Citigroup, Inc." },
  { ticker: "CFG", name: "Citizens Financial Group, Inc." },
  { ticker: "CLX", name: "Clorox Company (The)" },
  { ticker: "CME", name: "CME Group Inc." },
  { ticker: "CMS", name: "CMS Energy Corporation" },
  { ticker: "KO", name: "Coca-Cola Company (The)" },
  { ticker: "CTSH", name: "Cognizant Technology Solutions " },
  { ticker: "CL", name: "Colgate-Palmolive Company" },
  { ticker: "CMCSA", name: "Comcast Corporation" },
  { ticker: "CAG", name: "ConAgra Brands, Inc." },
  { ticker: "COP", name: "ConocoPhillips" },
  { ticker: "ED", name: "Consolidated Edison, Inc." },
  { ticker: "STZ", name: "Constellation Brands, Inc." },
  { ticker: "CEG", name: "Constellation Energy Corporatio" },
  { ticker: "COO", name: "The Cooper Companies, Inc." },
  { ticker: "CPRT", name: "Copart, Inc." },
  { ticker: "GLW", name: "Corning Incorporated" },
  { ticker: "CPAY", name: "Corpay, Inc." },
  { ticker: "CTVA", name: "Corteva, Inc." },
  { ticker: "CSGP", name: "CoStar Group, Inc." },
  { ticker: "COST", name: "Costco Wholesale Corporation" },
  { ticker: "CTRA", name: "Coterra Energy Inc." },
  { ticker: "CRWD", name: "CrowdStrike Holdings, Inc." },
  { ticker: "CCI", name: "Crown Castle Inc." },
  { ticker: "CSX", name: "CSX Corporation" },
  { ticker: "CMI", name: "Cummins Inc." },
  { ticker: "CVS", name: "CVS Health Corporation" },
  { ticker: "DHR", name: "Danaher Corporation" },
  { ticker: "DRI", name: "Darden Restaurants, Inc." },
  { ticker: "DVA", name: "DaVita Inc." },
  { ticker: "DAY", name: "Dayforce, Inc." },
  { ticker: "DECK", name: "Deckers Outdoor Corporation" },
  { ticker: "DE", name: "Deere & Company" },
  { ticker: "DELL", name: "Dell Technologies Inc." },
  { ticker: "DAL", name: "Delta Air Lines, Inc." },
  { ticker: "DVN", name: "Devon Energy Corporation" },
  { ticker: "DXCM", name: "DexCom, Inc." },
  { ticker: "FANG", name: "Diamondback Energy, Inc." },
  { ticker: "DLR", name: "Digital Realty Trust, Inc." },
  { ticker: "DFS", name: "Discover Financial Services" },
  { ticker: "DG", name: "Dollar General Corporation" },
  { ticker: "DLTR", name: "Dollar Tree, Inc." },
  { ticker: "D", name: "Dominion Energy, Inc." },
  { ticker: "DPZ", name: "Domino's Pizza Inc" },
  { ticker: "DOV", name: "Dover Corporation" },
  { ticker: "DOW", name: "Dow Inc." },
  { ticker: "DHI", name: "D.R. Horton, Inc." },
  { ticker: "DTE", name: "DTE Energy Company" },
  { ticker: "DUK", name: "Duke Energy Corporation (Holdin" },
  { ticker: "DD", name: "DuPont de Nemours, Inc." },
  { ticker: "EMN", name: "Eastman Chemical Company" },
  { ticker: "ETN", name: "Eaton Corporation, PLC" },
  { ticker: "EBAY", name: "eBay Inc." },
  { ticker: "ECL", name: "Ecolab Inc." },
  { ticker: "EIX", name: "Edison International" },
  { ticker: "EW", name: "Edwards Lifesciences Corporatio" },
  { ticker: "EA", name: "Electronic Arts Inc." },
  { ticker: "ELV", name: "Elevance Health, Inc." },
  { ticker: "EMR", name: "Emerson Electric Company" },
  { ticker: "ENPH", name: "Enphase Energy, Inc." },
  { ticker: "ETR", name: "Entergy Corporation" },
  { ticker: "EOG", name: "EOG Resources, Inc." },
  { ticker: "EPAM", name: "EPAM Systems, Inc." },
  { ticker: "EQT", name: "EQT Corporation" },
  { ticker: "EFX", name: "Equifax, Inc." },
  { ticker: "EQIX", name: "Equinix, Inc." },
  { ticker: "EQR", name: "Equity Residential" },
  { ticker: "ERIE", name: "Erie Indemnity Company" },
  { ticker: "ESS", name: "Essex Property Trust, Inc." },
  { ticker: "EL", name: "Estee Lauder Companies, Inc. (T" },
  { ticker: "EG", name: "Everest Group, Ltd." },
  { ticker: "EVRG", name: "Evergy, Inc." },
  { ticker: "ES", name: "Eversource Energy (D/B/A)" },
  { ticker: "EXC", name: "Exelon Corporation" },
  { ticker: "EXPE", name: "Expedia Group, Inc." },
  { ticker: "EXPD", name: "Expeditors International of Was" },
  { ticker: "EXR", name: "Extra Space Storage Inc" },
  { ticker: "XOM", name: "Exxon Mobil Corporation" },
  { ticker: "FFIV", name: "F5, Inc." },
  { ticker: "FDS", name: "FactSet Research Systems Inc." },
  { ticker: "FICO", name: "Fair Isaac Corporation" },
  { ticker: "FAST", name: "Fastenal Company" },
  { ticker: "FRT", name: "Federal Realty Investment Trust" },
  { ticker: "FDX", name: "FedEx Corporation" },
  { ticker: "FIS", name: "Fidelity National Information S" },
  { ticker: "FITB", name: "Fifth Third Bancorp" },
  { ticker: "FSLR", name: "First Solar, Inc." },
  { ticker: "FE", name: "FirstEnergy Corp." },
  { ticker: "FI", name: "Fiserv, Inc." },
  { ticker: "FMC", name: "FMC Corporation" },
  { ticker: "F", name: "Ford Motor Company" },
  { ticker: "FTNT", name: "Fortinet, Inc." },
  { ticker: "FTV", name: "Fortive Corporation" },
  { ticker: "FOXA", name: "Fox Corporation" },
  { ticker: "FOX", name: "Fox Corporation" },
  { ticker: "BEN", name: "Franklin Resources, Inc." },
  { ticker: "FCX", name: "Freeport-McMoRan, Inc." },
  { ticker: "GRMN", name: "Garmin Ltd." },
  { ticker: "IT", name: "Gartner, Inc." },
  { ticker: "GE", name: "GE Aerospace" },
  { ticker: "GEHC", name: "GE HealthCare Technologies Inc." },
  { ticker: "GEV", name: "GE Vernova Inc." },
  { ticker: "GEN", name: "Gen Digital Inc." },
  { ticker: "GNRC", name: "Generac Holdlings Inc." },
  { ticker: "GD", name: "General Dynamics Corporation" },
  { ticker: "GIS", name: "General Mills, Inc." },
  { ticker: "GM", name: "General Motors Company" },
  { ticker: "GPC", name: "Genuine Parts Company" },
  { ticker: "GILD", name: "Gilead Sciences, Inc." },
  { ticker: "GPN", name: "Global Payments Inc." },
  { ticker: "GL", name: "Globe Life Inc." },
  { ticker: "GDDY", name: "GoDaddy Inc." },
  { ticker: "GS", name: "Goldman Sachs Group, Inc. (The)" },
  { ticker: "HAL", name: "Halliburton Company" },
  { ticker: "HIG", name: "Hartford Financial Services Gro" },
  { ticker: "HAS", name: "Hasbro, Inc." },
  { ticker: "HCA", name: "HCA Healthcare, Inc." },
  { ticker: "DOC", name: "Healthpeak Properties, Inc." },
  { ticker: "HSIC", name: "Henry Schein, Inc." },
  { ticker: "HSY", name: "The Hershey Company" },
  { ticker: "HES", name: "Hess Corporation" },
  { ticker: "HPE", name: "Hewlett Packard Enterprise Comp" },
  { ticker: "HLT", name: "Hilton Worldwide Holdings Inc." },
  { ticker: "HOLX", name: "Hologic, Inc." },
  { ticker: "HD", name: "Home Depot, Inc. (The)" },
  { ticker: "HON", name: "Honeywell International Inc." },
  { ticker: "HRL", name: "Hormel Foods Corporation" },
  { ticker: "HST", name: "Host Hotels & Resorts, Inc." },
  { ticker: "HWM", name: "Howmet Aerospace Inc." },
  { ticker: "HPQ", name: "HP Inc." },
  { ticker: "HUBB", name: "Hubbell Inc" },
  { ticker: "HUM", name: "Humana Inc." },
  { ticker: "HBAN", name: "Huntington Bancshares Incorpora" },
  { ticker: "HII", name: "Huntington Ingalls Industries, " },
  { ticker: "IBM", name: "International Business Machines" },
  { ticker: "IEX", name: "IDEX Corporation" },
  { ticker: "IDXX", name: "IDEXX Laboratories, Inc." },
  { ticker: "ITW", name: "Illinois Tool Works Inc." },
  { ticker: "INCY", name: "Incyte Corporation" },
  { ticker: "IR", name: "Ingersoll Rand Inc." },
  { ticker: "PODD", name: "Insulet Corporation" },
  { ticker: "INTC", name: "Intel Corporation" },
  { ticker: "ICE", name: "Intercontinental Exchange Inc." },
  { ticker: "IFF", name: "International Flavors & Fragran" },
  { ticker: "IP", name: "International Paper Company" },
  { ticker: "IPG", name: "Interpublic Group of Companies," },
  { ticker: "INTU", name: "Intuit Inc." },
  { ticker: "ISRG", name: "Intuitive Surgical, Inc." },
  { ticker: "IVZ", name: "Invesco Ltd" },
  { ticker: "INVH", name: "Invitation Homes Inc." },
  { ticker: "IQV", name: "IQVIA Holdings, Inc." },
  { ticker: "IRM", name: "Iron Mountain Incorporated (Del" },
  { ticker: "JBHT", name: "J.B. Hunt Transport Services, I" },
  { ticker: "JBL", name: "Jabil Inc." },
  { ticker: "JKHY", name: "Jack Henry & Associates, Inc." },
  { ticker: "J", name: "Jacobs Solutions Inc." },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "JCI", name: "Johnson Controls International " },
  { ticker: "JPM", name: "JP Morgan Chase & Co." },
  { ticker: "JNPR", name: "Juniper Networks, Inc." },
  { ticker: "K", name: "Kellanova" },
  { ticker: "KVUE", name: "Kenvue Inc." },
  { ticker: "KDP", name: "Keurig Dr Pepper Inc." },
  { ticker: "KEY", name: "KeyCorp" },
  { ticker: "KEYS", name: "Keysight Technologies Inc." },
  { ticker: "KMB", name: "Kimberly-Clark Corporation" },
  { ticker: "KIM", name: "Kimco Realty Corporation (HC)" },
  { ticker: "KMI", name: "Kinder Morgan, Inc." },
  { ticker: "KKR", name: "KKR & Co. Inc." },
  { ticker: "KLAC", name: "KLA Corporation" },
  { ticker: "KHC", name: "The Kraft Heinz Company" },
  { ticker: "KR", name: "Kroger Company (The)" },
  { ticker: "LHX", name: "L3Harris Technologies, Inc." },
  { ticker: "LH", name: "Labcorp Holdings Inc." },
  { ticker: "LRCX", name: "Lam Research Corporation" },
  { ticker: "LW", name: "Lamb Weston Holdings, Inc." },
  { ticker: "LVS", name: "Las Vegas Sands Corp." },
  { ticker: "LDOS", name: "Leidos Holdings, Inc." },
  { ticker: "LEN", name: "Lennar Corporation" },
  { ticker: "LLY", name: "Eli Lilly and Company" },
  { ticker: "LIN", name: "Linde plc" },
  { ticker: "LYV", name: "Live Nation Entertainment, Inc." },
  { ticker: "LKQ", name: "LKQ Corporation" },
  { ticker: "LMT", name: "Lockheed Martin Corporation" },
  { ticker: "L", name: "Loews Corporation" },
  { ticker: "LOW", name: "Lowe's Companies, Inc." },
  { ticker: "LULU", name: "lululemon athletica inc." },
  { ticker: "LYB", name: "LyondellBasell Industries NV" },
  { ticker: "MTB", name: "M&T Bank Corporation" },
  { ticker: "MRO", name: "Marathon Oil Corporation" },
  { ticker: "MPC", name: "Marathon Petroleum Corporation" },
  { ticker: "MKTX", name: "MarketAxess Holdings, Inc." },
  { ticker: "MAR", name: "Marriott International" },
  { ticker: "MMC", name: "Marsh & McLennan Companies, Inc" },
  { ticker: "MLM", name: "Martin Marietta Materials, Inc." },
  { ticker: "MAS", name: "Masco Corporation" },
  { ticker: "MA", name: "Mastercard Incorporated" },
  { ticker: "MTCH", name: "Match Group, Inc." },
  { ticker: "MKC", name: "McCormick & Company, Incorporat" },
  { ticker: "MCD", name: "McDonald's Corporation" },
  { ticker: "MCK", name: "McKesson Corporation" },
  { ticker: "MDT", name: "Medtronic plc." },
  { ticker: "MRK", name: "Merck & Company, Inc." },
  { ticker: "META", name: "Meta Platforms, Inc." },
  { ticker: "MET", name: "MetLife, Inc." },
  { ticker: "MTD", name: "Mettler-Toledo International, I" },
  { ticker: "MGM", name: "MGM Resorts International" },
  { ticker: "MCHP", name: "Microchip Technology Incorporat" },
  { ticker: "MU", name: "Micron Technology, Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "MAA", name: "Mid-America Apartment Communiti" },
  { ticker: "MRNA", name: "Moderna, Inc." },
  { ticker: "MHK", name: "Mohawk Industries, Inc." },
  { ticker: "MOH", name: "Molina Healthcare Inc" },
  { ticker: "TAP", name: "Molson Coors Beverage Company" },
  { ticker: "MDLZ", name: "Mondelez International, Inc." },
  { ticker: "MPWR", name: "Monolithic Power Systems, Inc." },
  { ticker: "MNST", name: "Monster Beverage Corporation" },
  { ticker: "MCO", name: "Moody's Corporation" },
  { ticker: "MS", name: "Morgan Stanley" },
  { ticker: "MOS", name: "Mosaic Company (The)" },
  { ticker: "MSI", name: "Motorola Solutions, Inc." },
  { ticker: "MSCI", name: "MSCI Inc." },
  { ticker: "NDAQ", name: "Nasdaq, Inc." },
  { ticker: "NTAP", name: "NetApp, Inc." },
  { ticker: "NFLX", name: "Netflix, Inc." },
  { ticker: "NEM", name: "Newmont Corporation" },
  { ticker: "NWSA", name: "News Corporation" },
  { ticker: "NWS", name: "News Corporation" },
  { ticker: "NEE", name: "NextEra Energy, Inc." },
  { ticker: "NKE", name: "Nike, Inc." },
  { ticker: "NI", name: "NiSource Inc" },
  { ticker: "NDSN", name: "Nordson Corporation" },
  { ticker: "NSC", name: "Norfolk Southern Corporation" },
  { ticker: "NTRS", name: "Northern Trust Corporation" },
  { ticker: "NOC", name: "Northrop Grumman Corporation" },
  { ticker: "NCLH", name: "Norwegian Cruise Line Holdings " },
  { ticker: "NRG", name: "NRG Energy, Inc." },
  { ticker: "NUE", name: "Nucor Corporation" },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "NVR", name: "NVR, Inc." },
  { ticker: "NXPI", name: "NXP Semiconductors N.V." },
  { ticker: "ORLY", name: "O'Reilly Automotive, Inc." },
  { ticker: "OXY", name: "Occidental Petroleum Corporatio" },
  { ticker: "ODFL", name: "Old Dominion Freight Line, Inc." },
  { ticker: "OMC", name: "Omnicom Group Inc." },
  { ticker: "ON", name: "ON Semiconductor Corporation" },
  { ticker: "OKE", name: "ONEOK, Inc." },
  { ticker: "ORCL", name: "Oracle Corporation" },
  { ticker: "OTIS", name: "Otis Worldwide Corporation" },
  { ticker: "PCAR", name: "PACCAR Inc." },
  { ticker: "PKG", name: "Packaging Corporation of Americ" },
  { ticker: "PLTR", name: "Palantir Technologies Inc." },
  { ticker: "PANW", name: "Palo Alto Networks, Inc." },
  { ticker: "PARA", name: "Paramount Global" },
  { ticker: "PH", name: "Parker-Hannifin Corporation" },
  { ticker: "PAYX", name: "Paychex, Inc." },
  { ticker: "PAYC", name: "Paycom Software, Inc." },
  { ticker: "PYPL", name: "PayPal Holdings, Inc." },
  { ticker: "PNR", name: "Pentair plc." },
  { ticker: "PEP", name: "Pepsico, Inc." },
  { ticker: "PFE", name: "Pfizer, Inc." },
  { ticker: "PCG", name: "Pacific Gas & Electric Co." },
  { ticker: "PM", name: "Philip Morris International Inc" },
  { ticker: "PSX", name: "Phillips 66" },
  { ticker: "PNW", name: "Pinnacle West Capital Corporati" },
  { ticker: "PNC", name: "PNC Financial Services Group, I" },
  { ticker: "POOL", name: "Pool Corporation" },
  { ticker: "PPG", name: "PPG Industries, Inc." },
  { ticker: "PPL", name: "PPL Corporation" },
  { ticker: "PFG", name: "Principal Financial Group Inc" },
  { ticker: "PG", name: "Procter & Gamble Company (The)" },
  { ticker: "PGR", name: "Progressive Corporation (The)" },
  { ticker: "PLD", name: "Prologis, Inc." },
  { ticker: "PRU", name: "Prudential Financial, Inc." },
  { ticker: "PEG", name: "Public Service Enterprise Group" },
  { ticker: "PTC", name: "PTC Inc." },
  { ticker: "PSA", name: "Public Storage" },
  { ticker: "PHM", name: "PulteGroup, Inc." },
  { ticker: "QRVO", name: "Qorvo, Inc." },
  { ticker: "PWR", name: "Quanta Services, Inc." },
  { ticker: "QCOM", name: "QUALCOMM Incorporated" },
  { ticker: "DGX", name: "Quest Diagnostics Incorporated" },
  { ticker: "RL", name: "Ralph Lauren Corporation" },
  { ticker: "RJF", name: "Raymond James Financial, Inc." },
  { ticker: "RTX", name: "RTX Corporation" },
  { ticker: "O", name: "Realty Income Corporation" },
  { ticker: "REG", name: "Regency Centers Corporation" },
  { ticker: "REGN", name: "Regeneron Pharmaceuticals, Inc." },
  { ticker: "RF", name: "Regions Financial Corporation" },
  { ticker: "RSG", name: "Republic Services, Inc." },
  { ticker: "RMD", name: "ResMed Inc." },
  { ticker: "RVTY", name: "Revvity, Inc." },
  { ticker: "ROK", name: "Rockwell Automation, Inc." },
  { ticker: "ROL", name: "Rollins, Inc." },
  { ticker: "ROP", name: "Roper Technologies, Inc." },
  { ticker: "ROST", name: "Ross Stores, Inc." },
  { ticker: "RCL", name: "Royal Caribbean Cruises Ltd." },
  { ticker: "SPGI", name: "S&P Global Inc." },
  { ticker: "CRM", name: "Salesforce, Inc." },
  { ticker: "SBAC", name: "SBA Communications Corporation" },
  { ticker: "SLB", name: "Schlumberger N.V." },
  { ticker: "STX", name: "Seagate Technology Holdings PLC" },
  { ticker: "SRE", name: "DBA Sempra" },
  { ticker: "NOW", name: "ServiceNow, Inc." },
  { ticker: "SHW", name: "Sherwin-Williams Company (The)" },
  { ticker: "SPG", name: "Simon Property Group, Inc." },
  { ticker: "SWKS", name: "Skyworks Solutions, Inc." },
  { ticker: "SJM", name: "The J.M. Smucker Company" },
  { ticker: "SW", name: "Smurfit WestRock plc" },
  { ticker: "SNA", name: "Snap-On Incorporated" },
  { ticker: "SOLV", name: "Solventum Corporation" },
  { ticker: "SO", name: "Southern Company (The)" },
  { ticker: "LUV", name: "Southwest Airlines Company" },
  { ticker: "SWK", name: "Stanley Black & Decker, Inc." },
  { ticker: "SBUX", name: "Starbucks Corporation" },
  { ticker: "STT", name: "State Street Corporation" },
  { ticker: "STLD", name: "Steel Dynamics, Inc." },
  { ticker: "STE", name: "STERIS plc (Ireland)" },
  { ticker: "SYK", name: "Stryker Corporation" },
  { ticker: "SMCI", name: "Super Micro Computer, Inc." },
  { ticker: "SYF", name: "Synchrony Financial" },
  { ticker: "SNPS", name: "Synopsys, Inc." },
  { ticker: "SYY", name: "Sysco Corporation" },
  { ticker: "TMUS", name: "T-Mobile US, Inc." },
  { ticker: "TROW", name: "T. Rowe Price Group, Inc." },
  { ticker: "TTWO", name: "Take-Two Interactive Software, " },
  { ticker: "TPR", name: "Tapestry, Inc." },
  { ticker: "TRGP", name: "Targa Resources, Inc." },
  { ticker: "TGT", name: "Target Corporation" },
  { ticker: "TEL", name: "TE Connectivity plc" },
  { ticker: "TDY", name: "Teledyne Technologies Incorpora" },
  { ticker: "TFX", name: "Teleflex Incorporated" },
  { ticker: "TER", name: "Teradyne, Inc." },
  { ticker: "TSLA", name: "Tesla, Inc." },
  { ticker: "TXN", name: "Texas Instruments Incorporated" },
  { ticker: "TXT", name: "Textron Inc." },
  { ticker: "TMO", name: "Thermo Fisher Scientific Inc" },
  { ticker: "TJX", name: "TJX Companies, Inc. (The)" },
  { ticker: "TSCO", name: "Tractor Supply Company" },
  { ticker: "TT", name: "Trane Technologies plc" },
  { ticker: "TDG", name: "Transdigm Group Incorporated" },
  { ticker: "TRV", name: "The Travelers Companies, Inc." },
  { ticker: "TRMB", name: "Trimble Inc." },
  { ticker: "TFC", name: "Truist Financial Corporation" },
  { ticker: "TYL", name: "Tyler Technologies, Inc." },
  { ticker: "TSN", name: "Tyson Foods, Inc." },
  { ticker: "USB", name: "U.S. Bancorp" },
  { ticker: "UBER", name: "Uber Technologies, Inc." },
  { ticker: "UDR", name: "UDR, Inc." },
  { ticker: "ULTA", name: "Ulta Beauty, Inc." },
  { ticker: "UNP", name: "Union Pacific Corporation" },
  { ticker: "UAL", name: "United Airlines Holdings, Inc." },
  { ticker: "UPS", name: "United Parcel Service, Inc." },
  { ticker: "URI", name: "United Rentals, Inc." },
  { ticker: "UNH", name: "UnitedHealth Group Incorporated" },
  { ticker: "UHS", name: "Universal Health Services, Inc." },
  { ticker: "VLO", name: "Valero Energy Corporation" },
  { ticker: "VTR", name: "Ventas, Inc." },
  { ticker: "VLTO", name: "Veralto Corp" },
  { ticker: "VRSN", name: "VeriSign, Inc." },
  { ticker: "VRSK", name: "Verisk Analytics, Inc." },
  { ticker: "VZ", name: "Verizon Communications Inc." },
  { ticker: "VRTX", name: "Vertex Pharmaceuticals Incorpor" },
  { ticker: "VTRS", name: "Viatris Inc." },
  { ticker: "VICI", name: "VICI Properties Inc." },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "VST", name: "Vistra Corp." },
  { ticker: "VMC", name: "Vulcan Materials Company (Holdi" },
  { ticker: "WRB", name: "W.R. Berkley Corporation" },
  { ticker: "GWW", name: "W.W. Grainger, Inc." },
  { ticker: "WAB", name: "Westinghouse Air Brake Technolo" },
  { ticker: "WBA", name: "Walgreens Boots Alliance, Inc." },
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "DIS", name: "Walt Disney Company (The)" },
  { ticker: "WBD", name: "Warner Bros. Discovery, Inc. - " },
  { ticker: "WM", name: "Waste Management, Inc." },
  { ticker: "WAT", name: "Waters Corporation" },
  { ticker: "WEC", name: "WEC Energy Group, Inc." },
  { ticker: "WFC", name: "Wells Fargo & Company" },
  { ticker: "WELL", name: "Welltower Inc." },
  { ticker: "WST", name: "West Pharmaceutical Services, I" },
  { ticker: "WDC", name: "Western Digital Corporation" },
  { ticker: "WY", name: "Weyerhaeuser Company" },
  { ticker: "WMB", name: "Williams Companies, Inc. (The)" },
  { ticker: "WTW", name: "Willis Towers Watson Public Lim" },
  { ticker: "WYNN", name: "Wynn Resorts, Limited" },
  { ticker: "XEL", name: "Xcel Energy Inc." },
  { ticker: "XYL", name: "Xylem Inc." },
  { ticker: "YUM", name: "Yum! Brands, Inc." },
  { ticker: "ZBRA", name: "Zebra Technologies Corporation" },
  { ticker: "ZBH", name: "Zimmer Biomet Holdings, Inc." },
  { ticker: "ZTS", name: "Zoetis Inc." },
];
