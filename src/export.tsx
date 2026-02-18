import { useState } from 'react'
import './export.css'
import logo from './assets/logos.png'

function ExportData() {
    const [showSidebar, setShowSidebar] = useState(false)
    const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('xlsx')
    const [exportSuccess, setExportSuccess] = useState(false)

    // Column selection
    const [selectedColumns, setSelectedColumns] = useState({
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
        scholarshipYear: true,
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

    const columnLabels: Record<string, string> = {
        lastName: 'Last Name',
        firstName: 'First Name',
        middleName: 'Middle Name',
        suffix: 'Suffix',
        street: 'Street/Purok',
        municipality: 'Municipality',
        barangay: 'Barangay',
        district: 'District',
        contactNumber: 'Contact Number',
        email: 'Email Address',
        scholarshipYear: 'Scholarship Year',
        category: 'Category',
        university: 'University',
        statusOfEntry: 'Status of Entry',
        course: 'Course',
        yearLevel: 'Year Level',
        status: 'Status',
        yearGraduated: 'Year Graduated',
        award: 'Award',
        seniorHSAttended: 'Senior HS Attended'
    }

    // Filters for export scope
    const [scopeFilters, setScopeFilters] = useState({
        status: { ongoing: true, graduated: true, terminated: true },
        district: { i: true, ii: true, iii: true },
        university: { tsu: true, tau: true },
        level: { undergraduate: true, jlss: true }
    })

    const toggleColumn = (col: string) => {
        setSelectedColumns(prev => ({ ...prev, [col]: !prev[col as keyof typeof prev] }))
    }

    const selectAllColumns = () => {
        const all: any = {}
        Object.keys(selectedColumns).forEach(k => all[k] = true)
        setSelectedColumns(all)
    }

    const deselectAllColumns = () => {
        const none: any = {}
        Object.keys(selectedColumns).forEach(k => none[k] = false)
        setSelectedColumns(none)
    }

    const toggleScopeFilter = (group: string, key: string) => {
        setScopeFilters(prev => ({
            ...prev,
            [group]: {
                ...(prev[group as keyof typeof prev]),
                [key]: !(prev[group as keyof typeof prev] as any)[key]
            }
        }))
    }

    const selectedColCount = Object.values(selectedColumns).filter(Boolean).length

    const handleExport = () => {
        if (selectedColCount === 0) return
        // Simulate export
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 3000)
    }

    const formatIcons: Record<string, string> = {
        csv: '📄',
        xlsx: '📊',
        pdf: '📋'
    }

    const formatDescriptions: Record<string, string> = {
        csv: 'Plain text, compatible with any spreadsheet app',
        xlsx: 'Excel workbook with formatting',
        pdf: 'Printable document, fixed layout'
    }

    return (
        <>
            {/* Header */}
            <div className="pane">
                <button className='hamburger' onClick={() => setShowSidebar(true)}>☰</button>
                <img className="logo" src={logo} alt="Logo" />
                <div className="header-text">
                    <span className="sm">Scholars Monitoring System</span>
                    <span className="psto">Provincial Science and Technology Office-Tarlac</span>
                </div>
            </div>

            <div className="export-page">
                <div className="export-header">
                    <div className="export-title-row">
                        <span className="material-symbols-outlined export-icon">download</span>
                        <div>
                            <h1 className="export-title">Export Data</h1>
                            <p className="export-subtitle">Choose your format, filters, and columns then download</p>
                        </div>
                    </div>
                </div>

                <div className="export-grid">

                    {/* LEFT COLUMN */}
                    <div className="export-left">

                        {/* Format Selection */}
                        <div className="export-card">
                            <h3 className="card-title">
                                <span className="material-symbols-outlined">file_present</span>
                                Export Format
                            </h3>
                            <div className="format-options">
                                {(['csv', 'xlsx', 'pdf'] as const).map(fmt => (
                                    <label
                                        key={fmt}
                                        className={`format-card ${exportFormat === fmt ? 'active' : ''}`}
                                        onClick={() => setExportFormat(fmt)}
                                    >
                                        <div className="format-radio">
                                            <div className={`radio-dot ${exportFormat === fmt ? 'checked' : ''}`} />
                                        </div>
                                        <div className="format-icon">{formatIcons[fmt]}</div>
                                        <div className="format-info">
                                            <span className="format-label">.{fmt.toUpperCase()}</span>
                                            <span className="format-desc">{formatDescriptions[fmt]}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Scope Filters */}
                        <div className="export-card">
                            <h3 className="card-title">
                                <span className="material-symbols-outlined">filter_list</span>
                                Filter Scope
                            </h3>
                            <p className="card-subtitle">Only matching records will be exported</p>

                            <div className="scope-grid">
                                <div className="scope-group">
                                    <h4 className="scope-label">Status</h4>
                                    {[
                                        { key: 'ongoing', label: 'Ongoing' },
                                        { key: 'graduated', label: 'Graduated' },
                                        { key: 'terminated', label: 'Terminated' }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="scope-option">
                                            <input
                                                type="checkbox"
                                                checked={(scopeFilters.status as any)[key]}
                                                onChange={() => toggleScopeFilter('status', key)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="scope-group">
                                    <h4 className="scope-label">District</h4>
                                    {[
                                        { key: 'i', label: 'District I' },
                                        { key: 'ii', label: 'District II' },
                                        { key: 'iii', label: 'District III' }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="scope-option">
                                            <input
                                                type="checkbox"
                                                checked={(scopeFilters.district as any)[key]}
                                                onChange={() => toggleScopeFilter('district', key)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="scope-group">
                                    <h4 className="scope-label">University</h4>
                                    {[
                                        { key: 'tsu', label: 'TSU' },
                                        { key: 'tau', label: 'TAU' }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="scope-option">
                                            <input
                                                type="checkbox"
                                                checked={(scopeFilters.university as any)[key]}
                                                onChange={() => toggleScopeFilter('university', key)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="scope-group">
                                    <h4 className="scope-label">Level</h4>
                                    {[
                                        { key: 'undergraduate', label: 'Undergraduate' },
                                        { key: 'jlss', label: 'JLSS' }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="scope-option">
                                            <input
                                                type="checkbox"
                                                checked={(scopeFilters.level as any)[key]}
                                                onChange={() => toggleScopeFilter('level', key)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="export-right">

                        {/* Column Selection */}
                        <div className="export-card columns-card">
                            <div className="card-title-row">
                                <h3 className="card-title">
                                    <span className="material-symbols-outlined">view_column</span>
                                    Select Columns
                                </h3>
                                <span className="col-count">{selectedColCount} / {Object.keys(selectedColumns).length} selected</span>
                            </div>
                            <p className="card-subtitle">Choose which fields to include in the export</p>

                            <div className="col-quick-actions">
                                <button className="quick-btn" onClick={selectAllColumns}>Select All</button>
                                <button className="quick-btn" onClick={deselectAllColumns}>Deselect All</button>
                            </div>

                            <div className="columns-grid">
                                {(Object.keys(selectedColumns) as Array<keyof typeof selectedColumns>).map(col => (
                                    <label key={col} className={`col-option ${selectedColumns[col] ? 'col-active' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns[col]}
                                            onChange={() => toggleColumn(col)}
                                        />
                                        <span>{columnLabels[col]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Export Summary + Button */}
                        <div className="export-card summary-card">
                            <h3 className="card-title">
                                <span className="material-symbols-outlined">summarize</span>
                                Export Summary
                            </h3>
                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span className="summary-key">Format</span>
                                    <span className="summary-val">.{exportFormat.toUpperCase()}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-key">Columns</span>
                                    <span className="summary-val">{selectedColCount} fields</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-key">Status filter</span>
                                    <span className="summary-val">
                                        {Object.entries(scopeFilters.status).filter(([,v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ') || 'None'}
                                    </span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-key">Districts</span>
                                    <span className="summary-val">
                                        {Object.entries(scopeFilters.district).filter(([,v]) => v).map(([k]) => `District ${k.toUpperCase()}`).join(', ') || 'None'}
                                    </span>
                                </div>
                            </div>

                            {exportSuccess && (
                                <div className="export-success">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Export successful! File downloaded.
                                </div>
                            )}

                            <button
                                className={`export-btn ${selectedColCount === 0 ? 'export-btn-disabled' : ''}`}
                                onClick={handleExport}
                                disabled={selectedColCount === 0}
                            >
                                <span className="material-symbols-outlined">download</span>
                                Export .{exportFormat.toUpperCase()}
                            </button>

                            {selectedColCount === 0 && (
                                <p className="export-warning">Select at least one column to export.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
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
                            <a href="#" className="sidebar-item">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span>Dashboard</span>
                            </a>
                            <a href="#" className="sidebar-item">
                                <span className="material-symbols-outlined">upload_file</span>
                                <span>Import Scholars</span>
                            </a>
                            <a href="#" className="sidebar-item active">
                                <span className="material-symbols-outlined">download</span>
                                <span>Export Data</span>
                            </a>
                            <div className="sidebar-divider"></div>
                            <a href="#" className="sidebar-item logout">
                                <span className="material-symbols-outlined">logout</span>
                                <span>Logout</span>
                            </a>
                        </nav>
                    </div>
                </>
            )}
        </>
    )
}

export default ExportData