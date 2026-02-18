import { useState, useRef, useCallback } from 'react'
import './import.css'
import logo from './assets/logos.png'

type Scholar = Record<string, string>

type ValidationError = {
    row: number
    field: string
    message: string
}

const REQUIRED_FIELDS = ['lastName', 'firstName', 'district', 'municipality', 'status', 'university', 'course']

const FIELD_LABELS: Record<string, string> = {
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
    seniorHSAttended: 'Senior HS Attended',
    ignore: '— Ignore this column —'
}

function parseCSV(text: string): { headers: string[], rows: Scholar[] } {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const row: Scholar = {}
        headers.forEach((h, i) => { row[h] = values[i] ?? '' })
        return row
    })
    return { headers, rows }
}

function autoMapHeaders(headers: string[]): Record<string, string> {
    const mapping: Record<string, string> = {}
    const normalize = (s: string) => s.toLowerCase().replace(/[\s_\-]/g, '')
    const fieldMap: Record<string, string> = {
        'lastname': 'lastName', 'surname': 'lastName', 'familyname': 'lastName',
        'firstname': 'firstName', 'givenname': 'firstName',
        'middlename': 'middleName', 'mi': 'middleName',
        'suffix': 'suffix',
        'street': 'street', 'purok': 'street', 'streetpurok': 'street',
        'municipality': 'municipality', 'city': 'municipality',
        'barangay': 'barangay', 'brgy': 'barangay',
        'district': 'district',
        'contactnumber': 'contactNumber', 'contact': 'contactNumber', 'phone': 'contactNumber', 'mobile': 'contactNumber',
        'email': 'email', 'emailaddress': 'email',
        'scholarshipyear': 'scholarshipYear', 'year': 'scholarshipYear',
        'category': 'category',
        'university': 'university', 'school': 'university',
        'statusofentry': 'statusOfEntry', 'entrytype': 'statusOfEntry',
        'course': 'course', 'program': 'course',
        'yearlevel': 'yearLevel', 'level': 'yearLevel',
        'status': 'status',
        'yeargraduated': 'yearGraduated', 'graduationyear': 'yearGraduated',
        'award': 'award', 'honor': 'award', 'honors': 'award',
        'seniorhsattended': 'seniorHSAttended', 'seniorhs': 'seniorHSAttended', 'shs': 'seniorHSAttended'
    }
    headers.forEach(h => {
        const key = normalize(h)
        mapping[h] = fieldMap[key] ?? 'ignore'
    })
    return mapping
}

function validateRows(rows: Scholar[], mapping: Record<string, string>): ValidationError[] {
    const errors: ValidationError[] = []
    const reversedMap: Record<string, string> = {}
    Object.entries(mapping).forEach(([col, field]) => { if (field !== 'ignore') reversedMap[field] = col })

    rows.forEach((row, i) => {
        REQUIRED_FIELDS.forEach(field => {
            const col = reversedMap[field]
            if (!col || !row[col]?.trim()) {
                errors.push({ row: i + 2, field: FIELD_LABELS[field] ?? field, message: 'Required field is empty' })
            }
        })
        const emailCol = reversedMap['email']
        if (emailCol && row[emailCol] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[emailCol])) {
            errors.push({ row: i + 2, field: 'Email Address', message: 'Invalid email format' })
        }
    })
    return errors
}

export default function ImportData() {
    const [showSidebar, setShowSidebar] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>('upload')
    const [headers, setHeaders] = useState<string[]>([])
    const [rows, setRows] = useState<Scholar[]>([])
    const [mapping, setMapping] = useState<Record<string, string>>({})
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [importing, setImporting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = useCallback((f: File) => {
        if (!f.name.endsWith('.csv')) return
        setFile(f)
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const { headers: h, rows: r } = parseCSV(text)
            setHeaders(h)
            setRows(r)
            setMapping(autoMapHeaders(h))
            setStep('map')
        }
        reader.readAsText(f)
    }, [])

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFile(f)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) handleFile(f)
    }

    const handleMappingChange = (col: string, field: string) => {
        setMapping(prev => ({ ...prev, [col]: field }))
    }

    const proceedToPreview = () => {
        const errs = validateRows(rows, mapping)
        setErrors(errs)
        setStep('preview')
    }

    const handleImport = () => {
        setImporting(true)
        // Simulate Firebase write delay
        setTimeout(() => {
            setImporting(false)
            setStep('done')
        }, 1800)
    }

    const reset = () => {
        setFile(null)
        setStep('upload')
        setHeaders([])
        setRows([])
        setMapping({})
        setErrors([])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const validRows = rows.filter((row, i) => !errors.some(e => e.row === i + 2))
    const errorRowNums = new Set(errors.map(e => e.row - 2))

    return (
        <>
            <div className="pane">
                <button className='hamburger' onClick={() => setShowSidebar(true)}>☰</button>
                <img className="logo" src={logo} alt="Logo" />
                <div className="header-text">
                    <span className="sm">Scholars Monitoring System</span>
                    <span className="psto">Provincial Science and Technology Office-Tarlac</span>
                </div>
            </div>

            <div className="import-page">

                {/* Page Header */}
                <div className="import-header">
                    <div className="import-title-row">
                        <span className="material-symbols-outlined import-icon">upload_file</span>
                        <div>
                            <h1 className="import-title">Import Scholars</h1>
                            <p className="import-subtitle">Upload a CSV file to bulk-add scholars to the system</p>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="steps-bar">
                    {['Upload File', 'Map Columns', 'Preview & Validate', 'Done'].map((label, i) => {
                        const stepKeys = ['upload', 'map', 'preview', 'done']
                        const current = stepKeys.indexOf(step)
                        const state = i < current ? 'done' : i === current ? 'active' : 'idle'
                        return (
                            <div key={i} className={`step-item ${state}`}>
                                <div className="step-circle">
                                    {i < current
                                        ? <span className="material-symbols-outlined">check</span>
                                        : <span>{i + 1}</span>
                                    }
                                </div>
                                <span className="step-label">{label}</span>
                                {i < 3 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
                            </div>
                        )
                    })}
                </div>

                {/* STEP 1: Upload */}
                {step === 'upload' && (
                    <div className="import-card">
                        <h3 className="card-title">
                            <span className="material-symbols-outlined">cloud_upload</span>
                            Upload CSV File
                        </h3>
                        <p className="card-subtitle">Only .CSV files are supported. Download the template below to get started.</p>

                        <div
                            className={`dropzone ${dragOver ? 'dragover' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span className="material-symbols-outlined dropzone-icon">upload_file</span>
                            <p className="dropzone-main">Drag & drop your CSV file here</p>
                            <p className="dropzone-sub">or click to browse</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                style={{ display: 'none' }}
                                onChange={handleFileInput}
                            />
                        </div>

                        <div className="template-row">
                            <span className="material-symbols-outlined template-icon">download</span>
                            <div>
                                <p className="template-label">Need a template?</p>
                                <p className="template-sub">Download the CSV template with all required column headers pre-filled.</p>
                            </div>
                            <button
                                className="template-btn"
                                onClick={() => {
                                    const headers = Object.keys(FIELD_LABELS).filter(k => k !== 'ignore').join(',')
                                    const blob = new Blob([headers + '\n'], { type: 'text/csv' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = 'scholars_template.csv'
                                    a.click()
                                    URL.revokeObjectURL(url)
                                }}
                            >
                                Download Template
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Map Columns */}
                {step === 'map' && (
                    <div className="import-card">
                        <div className="card-title-row">
                            <h3 className="card-title">
                                <span className="material-symbols-outlined">table_chart</span>
                                Map Columns
                            </h3>
                            <span className="file-badge">
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>description</span>
                                {file?.name}
                            </span>
                        </div>
                        <p className="card-subtitle">
                            Match each column from your file to the correct field. Auto-matched where possible.
                            <strong> {rows.length} rows detected.</strong>
                        </p>

                        <div className="map-table">
                            <div className="map-header-row">
                                <span>Your Column</span>
                                <span>Sample Data</span>
                                <span>Maps To</span>
                            </div>
                            {headers.map(col => (
                                <div key={col} className="map-row">
                                    <div className="map-col-name">{col}</div>
                                    <div className="map-sample">{rows[0]?.[col] ?? '—'}</div>
                                    <select
                                        className="map-select"
                                        value={mapping[col] ?? 'ignore'}
                                        onChange={(e) => handleMappingChange(col, e.target.value)}
                                    >
                                        {Object.entries(FIELD_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="required-notice">
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>info</span>
                            Required fields: {REQUIRED_FIELDS.map(f => FIELD_LABELS[f]).join(', ')}
                        </div>

                        <div className="step-actions">
                            <button className="back-btn" onClick={reset}>← Back</button>
                            <button className="next-btn" onClick={proceedToPreview}>
                                Preview & Validate →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Preview & Validate */}
                {step === 'preview' && (
                    <div className="import-card preview-card">
                        <div className="card-title-row">
                            <h3 className="card-title">
                                <span className="material-symbols-outlined">preview</span>
                                Preview & Validate
                            </h3>
                            <div className="preview-badges">
                                <span className="badge-ok">{validRows.length} valid</span>
                                {errors.length > 0 && <span className="badge-err">{errorRowNums.size} with issues</span>}
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="errors-panel">
                                <div className="errors-title">
                                    <span className="material-symbols-outlined">warning</span>
                                    {errors.length} validation issue{errors.length > 1 ? 's' : ''} found — these rows will be skipped
                                </div>
                                <div className="errors-list">
                                    {errors.slice(0, 8).map((err, i) => (
                                        <div key={i} className="error-item">
                                            <span className="err-row">Row {err.row}</span>
                                            <span className="err-field">{err.field}</span>
                                            <span className="err-msg">{err.message}</span>
                                        </div>
                                    ))}
                                    {errors.length > 8 && <p className="more-errors">+{errors.length - 8} more issues...</p>}
                                </div>
                            </div>
                        )}

                        <div className="preview-table-wrap">
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {headers.filter(h => mapping[h] !== 'ignore').map(h => (
                                            <th key={h}>{FIELD_LABELS[mapping[h]] ?? mapping[h]}</th>
                                        ))}
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.slice(0, 20).map((row, i) => {
                                        const hasError = errorRowNums.has(i)
                                        return (
                                            <tr key={i} className={hasError ? 'row-error' : 'row-ok'}>
                                                <td className="row-num">{i + 2}</td>
                                                {headers.filter(h => mapping[h] !== 'ignore').map(h => (
                                                    <td key={h}>{row[h] || '—'}</td>
                                                ))}
                                                <td>
                                                    {hasError
                                                        ? <span className="status-tag err-tag">⚠ Issues</span>
                                                        : <span className="status-tag ok-tag">✓ Valid</span>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {rows.length > 20 && (
                                <p className="preview-more">Showing first 20 of {rows.length} rows</p>
                            )}
                        </div>

                        <div className="step-actions">
                            <button className="back-btn" onClick={() => setStep('map')}>← Back</button>
                            <button
                                className={`next-btn ${validRows.length === 0 ? 'disabled-btn' : ''}`}
                                onClick={handleImport}
                                disabled={validRows.length === 0 || importing}
                            >
                                {importing
                                    ? <><span className="spinner" /> Importing...</>
                                    : <>Import {validRows.length} Scholar{validRows.length !== 1 ? 's' : ''} →</>
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Done */}
                {step === 'done' && (
                    <div className="import-card done-card">
                        <div className="done-icon-wrap">
                            <span className="material-symbols-outlined done-check">check_circle</span>
                        </div>
                        <h2 className="done-title">Import Successful!</h2>
                        <p className="done-sub">
                            <strong>{validRows.length}</strong> scholar{validRows.length !== 1 ? 's' : ''} have been added to the system.
                            {errorRowNums.size > 0 && <> <strong>{errorRowNums.size}</strong> row{errorRowNums.size !== 1 ? 's were' : ' was'} skipped due to validation errors.</>}
                        </p>
                        <div className="done-actions">
                            <button className="done-btn-primary" onClick={reset}>Import Another File</button>
                            <a href="#" className="done-btn-secondary">Go to Dashboard</a>
                        </div>
                    </div>
                )}
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
                            <a href="#" className="sidebar-item active">
                                <span className="material-symbols-outlined">upload_file</span>
                                <span>Import Scholars</span>
                            </a>
                            <a href="#" className="sidebar-item">
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