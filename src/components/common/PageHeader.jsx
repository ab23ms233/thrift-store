import "./PageHeader.css"

function PageHeader({
    header,
    description
}) {
    return (
        <div className="page-description">
            <h3 className="page-header">
                {header}
            </h3>
            <p className="page-label">
                {description}
            </p>
        </div>
    )
}

export default PageHeader