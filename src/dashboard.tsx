import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import './dashboard.css'
import logo from './assets/logos.png'
import { Link, useNavigate } from "react-router-dom";


function Dashboard(){
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [selectedLevel, setSelectedLevel] = useState<string>('')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')
    const [customYear, setCustomYear] = useState<string>('')
    const [showCustomYearInput, setShowCustomYearInput] = useState<boolean>(false)
    const [customGradYear, setCustomGradYear] = useState<string>('')
    const [showCustomGradYearInput, setShowCustomGradYearInput] = useState<boolean>(false)
    const [manualAddress, setManualAddress] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
    const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
    const [showColumnPicker, setShowColumnPicker] = useState(false)

    // Column visibility — declared early so columnLabels and helpers can reference its type
    const [visibleColumns, setVisibleColumns] = useState({
        lastName: true,
        firstName: true,
        middleName: false,
        suffix: false,
        street: false,
        municipality: true,
        barangay: false,
        district: true,
        contactNumber: false,
        email: false,
        scholarshipYear: false,
        category: true,
        university: true,
        statusOfEntry: false,
        course: true,
        yearLevel: true,
        status: true,
        yearGraduated: false,
        award: false,
        seniorHSAttended: false
    })

    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = () => setOpenMenuIndex(null)
        if (openMenuIndex !== null) {
            document.addEventListener('click', handleClick)
        }
        return () => document.removeEventListener('click', handleClick)
    }, [openMenuIndex])

    // Scholar data
    const scholarsData = [
        {
            lastName: 'Dela Cruz', firstName: 'Juan', middleName: 'Santos', suffix: 'Jr.',
            street: 'Purok 3', municipality: 'Tarlac City', barangay: 'Poblacion', district: 'I',
            contactNumber: '09123456789', email: 'juan@email.com', scholarshipYear: '2022',
            category: 'JLSS', university: 'TSU', statusOfEntry: 'Free Tuition', course: 'BSIT',
            yearLevel: '4th', status: 'Ongoing', yearGraduated: '—', award: '—', seniorHSAttended: 'TNHS'
        },
        {
            lastName: 'Grande', firstName: 'Ariana', middleName: 'Marie', suffix: '—',
            street: 'Purok 1', municipality: 'Capas', barangay: 'Manga', district: 'III',
            contactNumber: '09987654321', email: 'ariana@email.com', scholarshipYear: '2023',
            category: 'Undergraduate', university: 'TAU', statusOfEntry: 'Opt-Out', course: 'BSGE',
            yearLevel: '1st', status: 'Ongoing', yearGraduated: '—', award: '—', seniorHSAttended: 'CNHS'
        }
    ]

    // Inline dropdown filter states
    const [filterYearOfAward, setFilterYearOfAward] = useState('')
    const [filterScholarship, setFilterScholarship] = useState('')
    const [filterMunicipality, setFilterMunicipality] = useState('')
    const [filterDistrict, setFilterDistrict] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterUniversity, setFilterUniversity] = useState('')
    const [filterEntryStatus, setFilterEntryStatus] = useState('')
    const [filterYearGraduated, setFilterYearGraduated] = useState('')
    const [filterSHSAttended, setFilterSHSAttended] = useState('')
    const [filterLatinHonor, setFilterLatinHonor] = useState('')
    const [filterCourse, setFilterCourse] = useState('')

    const filteredScholars = scholarsData.filter(s => {
        const q = searchQuery.toLowerCase()
        if (q && !Object.values(s).some(v => v.toLowerCase().includes(q))) return false
        if (filterYearOfAward && s.scholarshipYear !== filterYearOfAward) return false
        if (filterScholarship && s.category !== filterScholarship) return false
        if (filterMunicipality && s.municipality !== filterMunicipality) return false
        if (filterDistrict && s.district !== filterDistrict) return false
        if (filterStatus && s.status !== filterStatus) return false
        if (filterUniversity && s.university !== filterUniversity) return false
        if (filterEntryStatus && s.statusOfEntry !== filterEntryStatus) return false
        if (filterYearGraduated && s.yearGraduated !== filterYearGraduated) return false
        if (filterSHSAttended && s.seniorHSAttended !== filterSHSAttended) return false
        if (filterLatinHonor && s.award !== filterLatinHonor) return false
        if (filterCourse && s.course !== filterCourse) return false
        return true
    })

    const resetAllFilters = () => {
        setFilterYearOfAward(''); setFilterScholarship(''); setFilterMunicipality('')
        setFilterDistrict(''); setFilterStatus(''); setFilterUniversity('')
        setFilterEntryStatus(''); setFilterYearGraduated(''); setFilterSHSAttended('')
        setFilterLatinHonor(''); setFilterCourse(''); setSearchQuery('')
    }

    const activeFilterCount = [filterYearOfAward, filterScholarship, filterMunicipality,
        filterDistrict, filterStatus, filterUniversity, filterEntryStatus,
        filterYearGraduated, filterSHSAttended, filterLatinHonor, filterCourse
    ].filter(Boolean).length

    // Column label map
    const columnLabels: Record<keyof typeof visibleColumns, string> = {
        lastName: 'Last Name', firstName: 'First Name', middleName: 'Middle Name',
        suffix: 'Suffix', street: 'Street/Purok', municipality: 'Municipality',
        barangay: 'Barangay', district: 'District', contactNumber: 'Contact Number',
        email: 'Email Address', scholarshipYear: 'Scholarship Year', category: 'Category',
        university: 'University', statusOfEntry: 'Status of Entry', course: 'Course',
        yearLevel: 'Year Level', status: 'Status', yearGraduated: 'Year Graduated',
        award: 'Award', seniorHSAttended: 'Senior HS Attended'
    }

    const toggleColumn = (col: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
    }

    const selectAllColumns = () => {
        const all = {} as typeof visibleColumns
        Object.keys(visibleColumns).forEach(k => (all as any)[k] = true)
        setVisibleColumns(all)
    }

    const deselectAllColumns = () => {
        const none = {} as typeof visibleColumns
        Object.keys(visibleColumns).forEach(k => (none as any)[k] = false)
        setVisibleColumns(none)
    }

    const selectedColCount = Object.values(visibleColumns).filter(Boolean).length

    // Derive unique values from data for dropdowns
    const unique = (key: keyof typeof scholarsData[0]) => [...new Set(scholarsData.map(s => s[key]))].filter(Boolean).sort()

    // Dynamic summary counts
    const totalScholars = scholarsData.length
    const graduatedCount = scholarsData.filter(s => s.status.toLowerCase() === 'graduated').length
    const ongoingCount = scholarsData.filter(s => s.status.toLowerCase() === 'ongoing').length
    const terminatedCount = scholarsData.filter(s => s.status.toLowerCase() === 'terminated').length

    // Municipality data by district
    const municipalitiesByDistrict: Record<string, string[]> = {
        'I': ['Anao', 'Camiling', 'Mayantoc', 'Moncada', 'Paniqui', 'Pura', 'Ramos', 'San Clemente', 'San Manuel', 'Santa Ignacia'],
        'II': ['Tarlac City', 'Gerona', 'San Jose', 'Victoria'],
        'III': ['Bamban', 'Capas', 'Concepcion', 'La Paz']
    }

    // Barangay data by municipality
    const barangayData: Record<string, string[]> = {
        'Anao': ['Baguindoc', 'Bantog', 'Campos','Carmen', 'Casili', 'Don Ramon', 'Hernando', 'Poblacion', 'Rizal', 'San Francisco East', 'San Francisco West', 'San Jose North', 'San Jose South', 'San Juan', 'San Roque', 'Santo Domingo', 'Sinense','Suaverdez'],
        'Bamban': ['Anupul', 'Banaba', 'Bangcu', 'Culubasa','Dela Cruz', 'La Paz', 'Lourdes', 'Malonzo', 'San Nicolas', 'San Pedro', 'San Rafael', 'San Roque', 'San Vicente', 'Santo Niño', 'Virgen de los Remedios'],
        'Camiling': ['Anoling 1st', 'Anoling 2nd', 'Anoling 3rd', 'Bacabac', 'Bacsay', 'Bancay 1st', 'San Isidro', 'Bilad', 'Birbira', 'Bobon 1st', 'Bobon 2nd', 'Bobon Caarosipan', 'Cabanabaan', 'Cacamilingan Norte', 'Cacamilingan Sur', 'Caniag', 'Carael', 'Cayaoan', 'Cayasan', 'Florida', 'Lasong', 'Libueg', 'Malacampa', 'Manakem', 'Manupeg', 'Marawi', 'Matubog', 'Nagrambacan', 'Nagserialan', 'Palimbo Proper', 'Palimbo-Caarosipan', 'Pao 1st', 'Pao 2nd', 'Pao 3rd', 'Papaac', 'Pindangan 1st', 'Pindangan 2nd', 'Poblacion A', 'Poblacion B', 'Poblacion C', 'Poblacion D', 'Poblacion E', 'Poblacion F', 'Poblacion G', 'Poblacion H', 'Poblacion I', 'Poblacion J', 'Santa Maria', 'Sawat', 'Sinilian 1st', 'Sinilian 2nd', 'Sinilian 3rd', 'Sinilian Cacalibosoan', 'Sinulatan 1st', 'Sinulatan 2nd', 'Surgui 1st', 'Surgui 2nd', 'Surgui 3rd', 'Tambugan', 'Telbang', 'Tuec'],
        'Capas': ['Aranguren', 'Bueno', 'Cristo Rey', 'Cubcub', 'Cutcut 1st', 'Cutcut 2nd', 'Dolores', 'Estrada', 'Lawy', 'Manga', 'Manlapig', 'Maruglu', 'O Donnell', 'Santa Juliana', 'Santa Lucia', 'Santa Rita', 'Santo Domingo 1st', 'Santo Domingo 2nd', 'Santo Rosario', 'Talaga'],
        'Concepcion': ['Alfonso', 'Balutu', 'Cafe', 'Calius Gueco', 'Caluluan', 'Castillo', 'Corazon de Jesus', 'Culatingan', 'Dungan', 'Dutung-A-Matas', 'Green Village', 'Lilibangan', 'Mabilog', 'Magao', 'Malupa', 'Minane', 'Panalicsian', 'Pando', 'Parang', 'Parulung', 'Pitabunan', 'San Agustin', 'San Antonio', 'San Bartolome', 'San Francisco', 'San Isidro', 'San Jose', 'San Juan', 'San Martin', 'San Nicolas', 'San Nicolas Balas', 'San Vicente', 'Santa Cruz', 'Santa Maria', 'Santa Monica', 'Santa Rita', 'Santa Rosa', 'Santiago', 'Santo Cristo', 'Santo Niño', 'Santo Rosario', 'Talimunduc Marimla', 'Talimunduc San Miguel', 'Telabanca', 'Tinang'],
        'Gerona': ['Abagon', 'Amacalan', 'Apsayan', 'Ayson', 'Bawa', 'Buenlag', 'Bularit', 'Calayaan', 'Carbonel', 'Cardona', 'Caturay', 'Danzo', 'Dicolor', 'Don Basilio', 'Luna', 'Mabini', 'Magaspac', 'Malayep', 'Matapitap', 'Matayumcab', 'New Salem', 'Oloybuaya', 'Padapada', 'Parsolingan', 'Pinasling', 'Plastado', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Quezon', 'Rizal', 'Salapungan', 'San Agustin', 'San Antonio', 'San Bartolome', 'San Jose', 'Santa Lucia', 'Santiago', 'Sembrano', 'Singat', 'Sulipa', 'Tagumbao', 'Tangcaran', 'Villa Paz'],
        'La Paz': ['Balanoy', 'Bantog-Caricutan', 'Caramutan', 'Caut', 'Comillas', 'Dumarais', 'Guevarra', 'Kapanikian', 'La Purisima', 'Lara', 'Laungcupang', 'Lomboy', 'Macalong', 'Matayumtayum', 'Mayang', 'Motrico', 'Paludpud', 'Rizal', 'San Isidro', 'San Roque', 'Sierra'],
        'Mayantoc':['Ambalingit', 'Baybayaoas', 'Bigbiga', 'Binbinaca', 'Calabtangan', 'Caocaoayan', 'Carabaoan', 'Cubcub', 'Gayonggayong', 'Gossood', 'Labney', 'Mamonit', 'Maniniog', 'Mapandan', 'Nambalan', 'Pedro L. Quines', 'Pitombayog', 'Poblacion Norte', 'Poblacion Sur', 'Rotrottooc', 'San Bartolome', 'San Jose', 'Taldiapan', 'Tangcarang'],
        'Moncada': ['Ablang-Sapang', 'Aringin', 'Atencio', 'Banaoang East', 'Banaoang West', 'Baquero Norte', 'Baquero Sur', 'Burgos', 'Calamay', 'Calapan', 'Camangaan East', 'Camangaan West', 'Camposanto 1-Norte', 'Camposanto 1-Sur', 'Camposanto 2', 'Capaoayan', 'Lapsing', 'Mabini', 'Maluac', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Rizal', 'San Juan', 'San Julian', 'San Leon', 'San Pedro', 'San Roque', 'Santa Lucia East', 'Santa Lucia West', 'Santa Maria', 'Santa Monica', 'Tolega Norte', 'Tolega Sur', 'Tubectubang', 'Villa'],
        'Paniqui': ['Abogado', 'Acocolao', 'Aduas', 'Apulid', 'Balaoang', 'Barang', 'Brillante', 'Burgos', 'Cabayaoasan', 'Canan', 'Carino', 'Cayanga', 'Colibangbang', 'Coral', 'Dapdap', 'Estacion', 'Mabilang', 'Manaois', 'Matalapitap', 'Nagmisaan', 'Nancamarinan', 'Nipaco', 'Patalan', 'Poblacion Norte', 'Poblacion Sur', 'Rang-ayan', 'Salumague', 'Samput', 'San Carlos', 'San Isidro', 'San Juan de Milla', 'Santa Ines', 'Sinigpit', 'Tablang', 'Ventenilla'],
        'Pura': ['Balite', 'Buenavista', 'Cadanglaan', 'Estipona', 'Linao', 'Maasin', 'Matindeg', 'Maungib', 'Naya', 'Nilasin 1st', 'Nilasin 2nd', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poroc', 'Singat'],
        'Ramos': ['Coral-Iloco', 'Guiteb', 'Pance', 'Poblacion Center', 'Poblacion North', 'Poblacion South', 'San Juan', 'San Raymundo', 'Toledo'],
        'San Clemente': ['Balloc', 'Bamban', 'Casipo', 'Catagudingan', 'Daldalayap', 'Doclong 1', 'Doclong 2', 'Maasin', 'Nagsabaran', 'Pit-ao', 'Poblacion Norte', 'Poblacion Sur'],
        'San Jose': ['Burgos', 'David', 'Iba', 'Labney', 'Lawacamulag', 'Lubigan', 'Maamot', 'Mababanaba', 'Moriones', 'Pao', 'San Juan de Valdez', 'Sula', 'Villa Aglipay'],
        'San Manuel': ['Colubot', 'Lanat', 'Legaspi', 'Mangandingay', 'Matarannoc', 'Pacpaco', 'Poblacion', 'Salcedo', 'San Agustin', 'San Felipe', 'San Jacinto', 'San Miguel', 'San Narciso', 'San Vicente', 'Santa Maria'],
        'Santa Ignacia': ['Baldios', 'Botbotones', 'Caanamongan', 'Cabaruan', 'Cabugbugan', 'Caduldulaoan', 'Calipayan', 'Macaguing', 'Nambalan', 'Padapada', 'Pilpila', 'Pinpinas', 'Poblacion East', 'Poblacion West', 'Pugo-Cecilio', 'San Francisco', 'San Sotero', 'San Vicente', 'Santa Ines Centro', 'Santa Ines East', 'Santa Ines West', 'Taguiporo', 'Timmaguab', 'Vargas'],
        'Tarlac City': ['Aguso', 'Alvindia Segundo', 'Amucao', 'Armenia', 'Asturias', 'Atioc', 'Balanti', 'Balete', 'Balibago I', 'Balibago II', 'Balingcanaway', 'Banaba', 'Bantog', 'Baras-baras', 'Batang-batang', 'Binauganan', 'Bora', 'Buenavista', 'Buhilit', 'Burot', 'Calingcuan', 'Capehan', 'Carangian', 'Care', 'Central', 'Culipat', 'Cut-cut I', 'Cut-cut II', 'Dalayap', 'Dela Paz', 'Dolores', 'Laoang', 'Ligtasan', 'Lourdes', 'Mabini', 'Maligaya', 'Maliwalo', 'Mapalacsiao', 'Mapalad', 'Matadero', 'Matatalaib', 'Paraiso', 'Poblacion', 'Salapungan', 'San Carlos', 'San Francisco', 'San Isidro', 'San Jose', 'San Jose de Urquico', 'San Juan de Mata', 'San Luis', 'San Manuel', 'San Miguel', 'San Nicolas', 'San Pablo', 'San Pascual', 'San Rafael', 'San Roque', 'San Sebastian', 'San Vicente', 'Santa Cruz', 'Santa Maria', 'Santo Cristo', 'Santo Domingo', 'Santo Niño', 'Sapang Maragul', 'Sapang Tagalog', 'Sepung Calzada', 'Sinait', 'Suizo', 'Tariji', 'Tibag', 'Tibagan', 'Trinidad', 'Ungot', 'Villa Bacolor'],
        'Victoria': ['Baculong', 'Balayang', 'Balbaloto', 'Bangar', 'Bantog', 'Batangbatang', 'Bulo', 'Cabuluan', 'Calibungan', 'Canarem', 'Cruz', 'Lalapac', 'Maluid', 'Mangolago', 'Masalasa', 'Palacpalac', 'San Agustin', 'San Andres', 'San Fernando', 'San Francisco', 'San Gavino', 'San Jacinto', 'San Nicolas', 'San Vicente', 'Santa Barbara', 'Santa Lucia']
    }

    const getBarangays = (): string[] => {
        return barangayData[selectedMunicipality] || []
    }

    const getMunicipalities = (): string[] => {
        return municipalitiesByDistrict[selectedDistrict] || []
    }

    const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value)
        setSelectedMunicipality('')
    }

    const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'custom') {
            setShowCustomYearInput(true)
        } else {
            setShowCustomYearInput(false)
            setCustomYear(e.target.value)
        }
    }

    const handleGradYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'custom') {
            setShowCustomGradYearInput(true)
        } else {
            setShowCustomGradYearInput(false)
            setCustomGradYear(e.target.value)
        }
    }

    return(
        <>
        <div className="pane">
                <button className='hamburger' onClick={() => setShowSidebar(true)}>☰</button>
                <img className="logo" src={logo} />
                <div className="header-text">
                    <span className="sm">Scholars Monitoring System</span>
                    <span className="psto">Provincial Science and Technology Office-Tarlac</span>
                </div>
                <button className='Add' onClick={() => setShowModal(true)}>+ Add Scholar</button>
        </div>
                <span className="overview-text">Scholars Summary</span>
        <div className="overview">
                <div className='total-bg'>
                <span className="material-symbols-outlined">group</span>
                <div>
                    <span className="total">{totalScholars}</span>
                    <span className="text">Total Scholars</span>
                </div>
                </div>
                <div className='graduated-bg'>
                <span className="material-symbols-outlined">school</span>
                <div>
                    <span className="total">{graduatedCount}</span>
                    <span className="text">Graduated Scholars</span>
                </div>
                </div>
                <div className='ongoing-bg'>
                <span className="material-symbols-outlined">check_circle</span>
                <div>
                    <span className="total">{ongoingCount}</span>
                    <span className="text">Ongoing Scholars</span>
                </div>
                </div>
                <div className='terminated-bg'>
                <span className="material-symbols-outlined">warning</span>
                <div>
                    <span className="total">{terminatedCount}</span>
                    <span className="text">Terminated Scholars</span>
                </div>
                </div>
        </div>  
        {/* Inline Filter Panel */}
        <div className="filter-panel">
            <div className="filter-panel-header">
                <span className="filter-panel-title">
                    <span className="material-symbols-outlined" style={{fontSize:18}}>filter_list</span>
                    Filters
                </span>
                {activeFilterCount > 0 && (
                    <button className="reset-filters-btn" onClick={resetAllFilters}>
                        ✕ Clear all ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Search row */}
            <div className="filter-search-row">
                <span className="material-symbols-outlined search-icon-inline">search</span>
                <input
                    className='filter-search-input'
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button className="search-clear-x" onClick={() => setSearchQuery('')}>✕</button>
                )}
            </div>

            {/* Row 1 dropdowns */}
            <div className="filter-dropdowns-row">
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">YEAR OF AWARD</label>
                    <select className="filter-dropdown" value={filterYearOfAward} onChange={e => setFilterYearOfAward(e.target.value)}>
                        <option value="">All</option>
                        {unique('scholarshipYear').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">SCHOLARSHIP</label>
                    <select className="filter-dropdown" value={filterScholarship} onChange={e => setFilterScholarship(e.target.value)}>
                        <option value="">All</option>
                        {unique('category').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">MUNICIPALITY</label>
                    <select className="filter-dropdown" value={filterMunicipality} onChange={e => setFilterMunicipality(e.target.value)}>
                        <option value="">All</option>
                        {unique('municipality').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">DISTRICT</label>
                    <select className="filter-dropdown" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
                        <option value="">All</option>
                        <option value="I">District I</option>
                        <option value="II">District II</option>
                        <option value="III">District III</option>
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">STATUS</label>
                    <select className="filter-dropdown" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Terminated">Terminated</option>
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">UNIVERSITY</label>
                    <select className="filter-dropdown" value={filterUniversity} onChange={e => setFilterUniversity(e.target.value)}>
                        <option value="">All</option>
                        <option value="TSU">TSU</option>
                        <option value="TAU">TAU</option>
                    </select>
                </div>
            </div>

            {/* Row 2 dropdowns */}
            <div className="filter-dropdowns-row">
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">ENTRY STATUS</label>
                    <select className="filter-dropdown" value={filterEntryStatus} onChange={e => setFilterEntryStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Free Tuition">Free Tuition</option>
                        <option value="Opt-Out">Opt-Out</option>
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">YEAR GRADUATED</label>
                    <select className="filter-dropdown" value={filterYearGraduated} onChange={e => setFilterYearGraduated(e.target.value)}>
                        <option value="">All</option>
                        {unique('yearGraduated').filter(v => v !== '—').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">SHS ATTENDED</label>
                    <select className="filter-dropdown" value={filterSHSAttended} onChange={e => setFilterSHSAttended(e.target.value)}>
                        <option value="">All</option>
                        {unique('seniorHSAttended').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">LATIN HONOR</label>
                    <select className="filter-dropdown" value={filterLatinHonor} onChange={e => setFilterLatinHonor(e.target.value)}>
                        <option value="">All</option>
                        <option value="Cum Laude">Cum Laude</option>
                        <option value="Magna Cum Laude">Magna Cum Laude</option>
                        <option value="Summa Cum Laude">Summa Cum Laude</option>
                    </select>
                </div>
                <div className="filter-dropdown-group">
                    <label className="filter-dropdown-label">COURSE/PROGRAM</label>
                    <select className="filter-dropdown" value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                        <option value="">All</option>
                        {unique('course').map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            </div>

            {/* Columns section */}
            <div className="filter-columns-section">
                <button
                    className="filter-columns-toggle"
                    onClick={() => setShowColumnPicker(p => !p)}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>view_column</span>
                    Columns
                    <span className="col-badge">{selectedColCount}/{Object.keys(visibleColumns).length}</span>
                    <span className="material-symbols-outlined toggle-chevron" style={{ fontSize: 16, marginLeft: 'auto' }}>
                        {showColumnPicker ? 'expand_less' : 'expand_more'}
                    </span>
                </button>

                {showColumnPicker && (
                    <div className="col-picker-panel">
                        <div className="col-picker-actions">
                            <button className="col-quick-btn" onClick={selectAllColumns}>Select All</button>
                            <button className="col-quick-btn" onClick={deselectAllColumns}>Deselect All</button>
                        </div>
                        <div className="col-picker-grid">
                            {(Object.keys(visibleColumns) as Array<keyof typeof visibleColumns>).map(col => (
                                <label key={col} className={`col-picker-item ${visibleColumns[col] ? 'col-checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[col]}
                                        onChange={() => toggleColumn(col)}
                                    />
                                    <span>{columnLabels[col]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className='table-container'>
          <div className='table-wrapper'>
            <table className='scholars-table'>
                <thead>
                    <tr>
                        {visibleColumns.lastName && <th>Last Name</th>}
                        {visibleColumns.firstName && <th>First Name</th>}
                        {visibleColumns.middleName && <th>Middle Name</th>}
                        {visibleColumns.suffix && <th>Suffix</th>}
                        {visibleColumns.street && <th>Street/Purok</th>}
                        {visibleColumns.municipality && <th>Municipality</th>}
                        {visibleColumns.barangay && <th>Barangay</th>}
                        {visibleColumns.district && <th>District</th>}
                        {visibleColumns.contactNumber && <th>Contact No.</th>}
                        {visibleColumns.email && <th>Email</th>}
                        {visibleColumns.scholarshipYear && <th>Scholarship Year</th>}
                        {visibleColumns.category && <th>Category</th>}
                        {visibleColumns.university && <th>University</th>}
                        {visibleColumns.statusOfEntry && <th>Status of Entry</th>}
                        {visibleColumns.course && <th>Course</th>}
                        {visibleColumns.yearLevel && <th>Year Level</th>}
                        {visibleColumns.status && <th>Status</th>}
                        {visibleColumns.yearGraduated && <th>Year Graduated</th>}
                        {visibleColumns.award && <th>Award</th>}
                        {visibleColumns.seniorHSAttended && <th>Senior HS Attended</th>}
                        <th className="actions-col"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredScholars.length === 0 ? (
                        <tr>
                            <td colSpan={21} className="no-results">No scholars found matching "{searchQuery}"</td>
                        </tr>
                    ) : (
                        filteredScholars.map((s, i) => (
                            <tr key={i} onClick={() => setOpenMenuIndex(null)}>
                                {visibleColumns.lastName && <td>{s.lastName}</td>}
                                {visibleColumns.firstName && <td>{s.firstName}</td>}
                                {visibleColumns.middleName && <td>{s.middleName}</td>}
                                {visibleColumns.suffix && <td>{s.suffix}</td>}
                                {visibleColumns.street && <td>{s.street}</td>}
                                {visibleColumns.municipality && <td>{s.municipality}</td>}
                                {visibleColumns.barangay && <td>{s.barangay}</td>}
                                {visibleColumns.district && <td>{s.district}</td>}
                                {visibleColumns.contactNumber && <td>{s.contactNumber}</td>}
                                {visibleColumns.email && <td>{s.email}</td>}
                                {visibleColumns.scholarshipYear && <td>{s.scholarshipYear}</td>}
                                {visibleColumns.category && <td>{s.category}</td>}
                                {visibleColumns.university && <td>{s.university}</td>}
                                {visibleColumns.statusOfEntry && <td>{s.statusOfEntry}</td>}
                                {visibleColumns.course && <td>{s.course}</td>}
                                {visibleColumns.yearLevel && <td>{s.yearLevel}</td>}
                                {visibleColumns.status && <td>{s.status}</td>}
                                {visibleColumns.yearGraduated && <td>{s.yearGraduated}</td>}
                                {visibleColumns.award && <td>{s.award}</td>}
                                {visibleColumns.seniorHSAttended && <td>{s.seniorHSAttended}</td>}
                                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                    <div className="action-wrapper">
                                        <button
                                            className="three-dots-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (openMenuIndex === i) {
                                                    setOpenMenuIndex(null)
                                                } else {
                                                    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                                                    setMenuPos({ top: rect.bottom + window.scrollY, left: rect.right - 120 })
                                                    setOpenMenuIndex(i)
                                                }
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>
        </div>

        {/* Add Scholar Modal */}
        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                    <h2>Add Scholar</h2>
                    <form className="scholar-form">
                        
                        {/* PERSONAL PROFILE */}
                        <h3 className="section-title">Personal Profile</h3>
                        
                        {/* Name */}
                        <div className="form-section">
                            <h4 className="subsection-title">Name</h4>
                            <input type="text" placeholder="Last Name" className="form-input" required />
                            <input type="text" placeholder="First Name" className="form-input" required />
                            <input type="text" placeholder="Middle Name" className="form-input" />
                            <select className="form-input">
                                <option value="">Suffix</option>
                                <option value="NA">N/A</option>
                                <option value="Jr.">Jr.</option>
                                <option value="Sr.">Sr.</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="form-section">
                            <h4 className="subsection-title">Address</h4>
                            <div className="checkbox-container">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={manualAddress}
                                        onChange={(e) => {
                                            setManualAddress(e.target.checked)
                                            if (e.target.checked) {
                                                setSelectedDistrict('')
                                                setSelectedMunicipality('')
                                            }
                                        }}
                                    />
                                    <span className="checkbox-label">Enter address manually (outside Tarlac)</span>
                                </label>
                            </div>
                            
                            {!manualAddress ? (
                                <>
                                    <select 
                                        className="form-input" 
                                        required
                                        value={selectedDistrict}
                                        onChange={handleDistrictChange}
                                    >
                                        <option value="">District</option>
                                        <option value="I">District I</option>
                                        <option value="II">District II</option>
                                        <option value="III">District III</option>
                                    </select>
                                    <select 
                                        className="form-input" 
                                        required
                                        value={selectedMunicipality}
                                        onChange={(e) => setSelectedMunicipality(e.target.value)}
                                        disabled={!selectedDistrict}
                                    >
                                        <option value="">Municipality</option>
                                        {getMunicipalities().map(municipality => (
                                            <option key={municipality} value={municipality}>{municipality}</option>
                                        ))}
                                    </select>
                                    <select className="form-input" required disabled={!selectedMunicipality}>
                                        <option value="">Barangay</option>
                                        {getBarangays().map(barangay => (
                                            <option key={barangay} value={barangay}>{barangay}</option>
                                        ))}
                                    </select>
                                    <input type="text" placeholder="Street or Purok" className="form-input" />
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="House/Unit Number, Street" className="form-input" required />
                                    <input type="text" placeholder="Barangay/Village" className="form-input" required />
                                    <input type="text" placeholder="City/Municipality" className="form-input" required />
                                    <input type="text" placeholder="Province" className="form-input" required />
                                    <input type="text" placeholder="Zip Code" className="form-input" />
                                </>
                            )}
                        </div>

                        {/* Contact Details */}
                        <div className="form-section">
                            <h4 className="subsection-title">Contact Details</h4>
                            <input type="email" placeholder="Email Address" className="form-input" required />
                            <input type="tel" placeholder="Contact Number" className="form-input" required />
                        </div>

                        {/* ACADEMIC PROFILE */}
                        <h3 className="section-title">Academic Profile</h3>

                        {/* Scholarship Availment */}
                        <div className="form-section">
                            <h4 className="subsection-title">Scholarship Availment</h4>
                            <select 
                                className="form-input" 
                                required
                                onChange={handleYearChange}
                            >
                                <option value="">Year</option>
                                {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => 2014 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                                <option value="custom">Add Custom Year...</option>
                            </select>
                            {showCustomYearInput && (
                                <input 
                                    type="number" 
                                    placeholder="Enter custom year" 
                                    className="form-input"
                                    value={customYear}
                                    onChange={(e) => setCustomYear(e.target.value)}
                                />
                            )}
                            <select 
                                className="form-input" 
                                required
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                            >
                                <option value="">Level</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="JLSS">JLSS</option>
                            </select>
                            <select className="form-input" required>
                                <option value="">Category</option>
                                <option value="RA 7687">RA 7687</option>
                                <option value="Merit">Merit</option>
                                {selectedLevel === 'JLSS' && (
                                    <option value="RA 10612">RA 10612</option>
                                )}
                            </select>
                        </div>

                        {/* University */}
                        <div className="form-section">
                            <h4 className="subsection-title">University</h4>
                            <select className="form-input" required>
                                <option value="">University</option>
                                <option value="TSU">Tarlac State University</option>
                                <option value="TAU">Tarlac Agricultural University</option>
                            </select>
                            <select className="form-input" required>
                                <option value="">Status of Entry</option>
                                <option value="Opt-Out">Opt-Out</option>
                                <option value="Free Tuition">Free Tuition</option>
                            </select>
                        </div>

                        {/* Course */}
                        <div className="form-section">
                            <h4 className="subsection-title">Course</h4>
                            <select className="form-input" required>
                                <option value="">Select Course</option>
                                <option value="Bachelor in Elementary Mathematics and Science Education">Bachelor in Elementary Mathematics and Science Education</option>
                                <option value="Bachelor in Mathematics Education">Bachelor in Mathematics Education</option>
                                <option value="Bachelor in Science Education">Bachelor in Science Education</option>
                                <option value="Bachelor in Technology and Livelihood Education with Specialization in Information and Communications Technology">Bachelor in Technology and Livelihood Education with Specialization in ICT</option>
                                <option value="Bachelor of Elementary Education in Mathematics">Bachelor of Elementary Education in Mathematics</option>
                                <option value="Bachelor of Elementary Education in Science and Health">Bachelor of Elementary Education in Science and Health</option>
                                <option value="Bachelor of Library and Information Science">Bachelor of Library and Information Science</option>
                                <option value="Bachelor of Sports Science">Bachelor of Sports Science</option>
                                <option value="BS Aeronautical Engineering">BS Aeronautical Engineering</option>
                                <option value="BS Aerospace Engineering">BS Aerospace Engineering</option>
                                <option value="BS Agribusiness">BS Agribusiness</option>
                                <option value="BS Agribusiness Economics">BS Agribusiness Economics</option>
                                <option value="BS Agribusiness Management">BS Agribusiness Management</option>
                                <option value="BS Agribusiness Management and Entrepreneurship">BS Agribusiness Management and Entrepreneurship</option>
                                <option value="BS Agricultural and Applied Economics">BS Agricultural and Applied Economics</option>
                                <option value="BS Agricultural and Biosystems Engineering">BS Agricultural and Biosystems Engineering</option>
                                <option value="BS Agricultural Chemistry">BS Agricultural Chemistry</option>
                                <option value="BS Agricultural Economics">BS Agricultural Economics</option>
                                <option value="BS Agricultural Education">BS Agricultural Education</option>
                                <option value="BS Agricultural Engineering">BS Agricultural Engineering</option>
                                <option value="BS Agricultural Technology">BS Agricultural Technology</option>
                                <option value="BS Agriculture">BS Agriculture</option>
                                <option value="BS Agroforestry">BS Agroforestry</option>
                                <option value="BS Animal Husbandry">BS Animal Husbandry</option>
                                <option value="BS Animal Science">BS Animal Science</option>
                                <option value="BS Applied Mathematics">BS Applied Mathematics</option>
                                <option value="BS Applied Physics">BS Applied Physics</option>
                                <option value="BS Applied Statistics">BS Applied Statistics</option>
                                <option value="BS Architecture">BS Architecture</option>
                                <option value="BS Artificial Intelligence">BS Artificial Intelligence</option>
                                <option value="BS Astronomy">BS Astronomy</option>
                                <option value="BS Biochemistry">BS Biochemistry</option>
                                <option value="BS Biology">BS Biology</option>
                                <option value="BS Biology for Teachers">BS Biology for Teachers</option>
                                <option value="BS Biomedical Engineering">BS Biomedical Engineering</option>
                                <option value="BS Biotechnology">BS Biotechnology</option>
                                <option value="BS Ceramics Engineering">BS Ceramics Engineering</option>
                                <option value="BS Chemical Engineering">BS Chemical Engineering</option>
                                <option value="BS Chemistry">BS Chemistry</option>
                                <option value="BS Chemistry for Teachers">BS Chemistry for Teachers</option>
                                <option value="BS Civil Engineering">BS Civil Engineering</option>
                                <option value="BS Clothing Technology">BS Clothing Technology</option>
                                <option value="BS Community Nutrition">BS Community Nutrition</option>
                                <option value="BS Computer Engineering">BS Computer Engineering</option>
                                <option value="BS Computer Science">BS Computer Science</option>
                                <option value="BS Cybersecurity">BS Cybersecurity</option>
                                <option value="BS Data Science">BS Data Science</option>
                                <option value="BS Development Communication major in Science Communication">BS Development Communication major in Science Communication</option>
                                <option value="BS Electrical Engineering">BS Electrical Engineering</option>
                                <option value="BS Electronics and Communications Engineering">BS Electronics and Communications Engineering</option>
                                <option value="BS Electronics Engineering">BS Electronics Engineering</option>
                                <option value="BS Energy Systems Management">BS Energy Systems Management</option>
                                <option value="BS Environmental and Sanitary Engineering">BS Environmental and Sanitary Engineering</option>
                                <option value="BS Environmental Engineering">BS Environmental Engineering</option>
                                <option value="BS Environmental Science">BS Environmental Science</option>
                                <option value="BS Fine Arts Major in Industrial Design">BS Fine Arts Major in Industrial Design</option>
                                <option value="BS Fisheries">BS Fisheries</option>
                                <option value="BS Fisheries and Aquatic Sciences">BS Fisheries and Aquatic Sciences</option>
                                <option value="BS Food Science and Technology">BS Food Science and Technology</option>
                                <option value="BS Food Technology">BS Food Technology</option>
                                <option value="BS Forestry">BS Forestry</option>
                                <option value="BS Geodetic Engineering">BS Geodetic Engineering</option>
                                <option value="BS Geography">BS Geography</option>
                                <option value="BS Geology">BS Geology</option>
                                <option value="BS Geothermal Engineering">BS Geothermal Engineering</option>
                                <option value="BS Health Sciences">BS Health Sciences</option>
                                <option value="BS Industrial Design">BS Industrial Design</option>
                                <option value="BS Industrial Engineering">BS Industrial Engineering</option>
                                <option value="BS Industrial Pharmacy">BS Industrial Pharmacy</option>
                                <option value="BS Information and Communications Technology">BS Information and Communications Technology</option>
                                <option value="BS Information System">BS Information System</option>
                                <option value="BS Information Technology">BS Information Technology</option>
                                <option value="BS Information Technology Systems">BS Information Technology Systems</option>
                                <option value="BS Instrumentation and Control Engineering">BS Instrumentation and Control Engineering</option>
                                <option value="BS Life Sciences">BS Life Sciences</option>
                                <option value="BS Manufacturing Engineering">BS Manufacturing Engineering</option>
                                <option value="BS Manufacturing Engineering-Management-Mechatronics and Robotics">BS Manufacturing Engineering-Management-Mechatronics and Robotics</option>
                                <option value="BS Marine Biology">BS Marine Biology</option>
                                <option value="BS Marine Science">BS Marine Science</option>
                                <option value="BS Materials Engineering">BS Materials Engineering</option>
                                <option value="BS Mathematics">BS Mathematics</option>
                                <option value="BS Mathematics and Science Teaching">BS Mathematics and Science Teaching</option>
                                <option value="BS Mathematics for Teachers">BS Mathematics for Teachers</option>
                                <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
                                <option value="BS Mechatronics Engineering">BS Mechatronics Engineering</option>
                                <option value="BS Medical Laboratory Science">BS Medical Laboratory Science</option>
                                <option value="BS Medical Technology">BS Medical Technology</option>
                                <option value="BS Metallurgical Engineering">BS Metallurgical Engineering</option>
                                <option value="BS Meteorology">BS Meteorology</option>
                                <option value="BS Microbiology">BS Microbiology</option>
                                <option value="BS Mining Engineering">BS Mining Engineering</option>
                                <option value="BS Molecular Biology and Biotechnology">BS Molecular Biology and Biotechnology</option>
                                <option value="BS Naval Architecture and Marine Engineering">BS Naval Architecture and Marine Engineering</option>
                                <option value="BS Nutrition">BS Nutrition</option>
                                <option value="BS Nutrition and Dietetics">BS Nutrition and Dietetics</option>
                                <option value="BS Petroleum Engineering">BS Petroleum Engineering</option>
                                <option value="BS Pharmaceutical Sciences">BS Pharmaceutical Sciences</option>
                                <option value="BS Physics">BS Physics</option>
                                <option value="BS Physics for Teachers">BS Physics for Teachers</option>
                                <option value="BS Psychology">BS Psychology</option>
                                <option value="BS Public Health">BS Public Health</option>
                                <option value="BS Railway Engineering and Management">BS Railway Engineering and Management</option>
                                <option value="BS Speech Pathology">BS Speech Pathology</option>
                                <option value="BS Statistics">BS Statistics</option>
                                <option value="BS Transportation Engineering">BS Transportation Engineering</option>
                                <option value="BSE Biological Sciences">BSE Biological Sciences</option>
                                <option value="BSE Biology">BSE Biology</option>
                                <option value="BSE Chemistry">BSE Chemistry</option>
                                <option value="BSE General Sciences">BSE General Sciences</option>
                                <option value="BSE Mathematics">BSE Mathematics</option>
                                <option value="BSE Physical Sciences">BSE Physical Sciences</option>
                                <option value="BSE Physics">BSE Physics</option>
                                <option value="BSE Science">BSE Science</option>
                                <option value="Doctor of Veterinary Medicine">Doctor of Veterinary Medicine</option>
                            </select>
                        </div>

                        {/* Academic Status */}
                        <div className="form-section">
                            <h4 className="subsection-title">Academic Status</h4>
                            <select className="form-input" required>
                                <option value="">Year Level</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                                <option value="5th">5th Year</option>
                                <option value="6th">6th Year</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                            <select className="form-input" required>
                                <option value="">Status</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Graduated">Graduated</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                            <select 
                                className="form-input"
                                onChange={handleGradYearChange}
                            >
                                <option value="">Year Graduated</option>
                                {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => 2014 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                                <option value="custom">Add Custom Year...</option>
                            </select>
                            {showCustomGradYearInput && (
                                <input 
                                    type="number" 
                                    placeholder="Enter custom year" 
                                    className="form-input"
                                    value={customGradYear}
                                    onChange={(e) => setCustomGradYear(e.target.value)}
                                />
                            )}
                            <select className="form-input">
                                <option value="">Award</option>
                                <option value="None">None</option>
                                <option value="Cum Laude">Cum Laude</option>
                                <option value="Magna Cum Laude">Magna Cum Laude</option>
                                <option value="Summa Cum Laude">Summa Cum Laude</option>
                            </select>
                            <input type="text" placeholder="Senior High School Attended" className="form-input" />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">Add Scholar</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Sidebar Menu */}
        {showSidebar && (
            <>
                <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
                <div className="sidebar">
                    <button className="sidebar-close" onClick={() => setShowSidebar(false)}>×</button>
                    <div className="sidebar-header">
                        <img className="sidebar-logo" src={logo} alt="Logo" />
                        <h3>Menu</h3>
                    </div>
                    <nav className="sidebar-nav">
  <Link to="/dashboard" className="sidebar-item active" onClick={() => setShowSidebar(false)}>
    <span className="material-symbols-outlined">dashboard</span>
    <span>Dashboard</span>
  </Link>

  <Link to="/import" className="sidebar-item" onClick={() => setShowSidebar(false)}>
    <span className="material-symbols-outlined">upload_file</span>
    <span>Import Scholars</span>
  </Link>

  <Link to="/export" className="sidebar-item" onClick={() => setShowSidebar(false)}>
    <span className="material-symbols-outlined">download</span>
    <span>Export Data</span>
  </Link>

  <div className="sidebar-divider"></div>

  <button
    type="button"
    className="sidebar-item logout"
    onClick={() => {
      setShowSidebar(false);
      navigate("/"); // back to login
    }}
  >
    <span className="material-symbols-outlined">logout</span>
    <span>Logout</span>
  </button>
</nav>

                </div>
            </>
        )}
        {/* Floating action dropdown portal — renders outside table to avoid overflow clipping */}
        {/* Floating action dropdown portal — renders outside table to avoid overflow clipping */}
        {openMenuIndex !== null && (
            <div
                className="action-dropdown"
                style={{ top: menuPos.top, left: menuPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="action-item edit-item" onClick={() => { alert(`Edit ${filteredScholars[openMenuIndex].firstName} ${filteredScholars[openMenuIndex].lastName}`); setOpenMenuIndex(null) }}>
                    <span className="material-symbols-outlined">edit</span> Edit
                </button>
                <button className="action-item delete-item" onClick={() => { alert(`Delete ${filteredScholars[openMenuIndex].firstName} ${filteredScholars[openMenuIndex].lastName}`); setOpenMenuIndex(null) }}>
                    <span className="material-symbols-outlined">delete</span> Delete
                </button>
            </div>
        )}
       </>
    )
}

export default Dashboard;