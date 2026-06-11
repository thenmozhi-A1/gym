import re

with open('src/Nutrition.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the bootstrap import
content = content.replace('import "bootstrap/dist/css/bootstrap.min.css";\n', '')

# Replace container
content = re.sub(r'<div className="container(.*?)">', r'<Container className="\1">', content)
content = re.sub(r'<section(.*?)className="container(.*?)"(.*?)>', r'<section\1\3><Container className="\2">', content)

# Replace row
content = re.sub(r'<div className="row(.*?)">', r'<Row className="\1">', content)

# Replace cols
content = re.sub(r'<div className="col-(.*?) (.*?)">', r'<Col className="\1 \2">', content)
content = re.sub(r'<div className="col-(.*?)">', r'<Col className="\1">', content)

# Note: We need to make sure we close them properly... 
# Actually this is a bad idea because of </div> vs </Container>.

# Better idea: Let's inject a CSS reset into PageWrapper that handles the bootstrap grid classes used in this file.
css_grid = """
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    max-width: 1300px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
  }
  .row > * {
    padding-right: 15px;
    padding-left: 15px;
  }
  .col-lg-3 { width: 100%; }
  .col-lg-4 { width: 100%; }
  .col-lg-5 { width: 100%; }
  .col-lg-7 { width: 100%; }
  .col-lg-8 { width: 100%; }
  .col-md-3 { width: 100%; }
  .col-md-4 { width: 100%; }
  .col-md-6 { width: 100%; }
  .col-6 { width: 50%; }
  .col-12 { width: 100%; }
  @media (min-width: 768px) {
    .col-md-3 { flex: 0 0 25%; max-width: 25%; }
    .col-md-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
  }
  @media (min-width: 992px) {
    .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
    .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-lg-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-lg-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-lg-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .d-lg-block { display: block !important; }
  }
  .d-none { display: none !important; }
  .d-flex { display: flex !important; }
  .justify-content-center { justify-content: center !important; }
  .justify-content-between { justify-content: space-between !important; }
  .align-items-center { align-items: center !important; }
  .text-center { text-align: center !important; }
  .text-warning { color: #ffc107 !important; }
  .text-secondary { color: #6c757d !important; }
  .text-white-50 { color: rgba(255, 255, 255, 0.5) !important; }
  .fw-black { font-weight: 900 !important; }
  .fw-bold { font-weight: 700 !important; }
  .mb-0 { margin-bottom: 0 !important; }
  .mb-4 { margin-bottom: 1.5rem !important; }
  .mb-5 { margin-bottom: 3rem !important; }
  .mt-4 { margin-top: 1.5rem !important; }
  .mt-5 { margin-top: 3rem !important; }
  .py-5 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
  .p-4 { padding: 1.5rem !important; }
  .gap-3 { gap: 1rem !important; }
  .g-4 { --bs-gutter-y: 1.5rem; --bs-gutter-x: 1.5rem; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-.5 * var(--bs-gutter-x)); margin-left: calc(-.5 * var(--bs-gutter-x)); }
  .g-4 > * { margin-top: var(--bs-gutter-y); padding-right: calc(var(--bs-gutter-x) * .5); padding-left: calc(var(--bs-gutter-x) * .5); }
  .g-3 { gap: 1rem; }
  .g-0 { gap: 0; }
  .mx-auto { margin-right: auto !important; margin-left: auto !important; }
  .display-1 { font-size: 5rem; font-weight: 300; line-height: 1.2; }
  .display-4 { font-size: 3.5rem; font-weight: 300; line-height: 1.2; }
  .display-6 { font-size: 2.5rem; font-weight: 300; line-height: 1.2; }
  .lead { font-size: 1.25rem; font-weight: 300; }
  .small { font-size: 0.875em; }
  .fs-5 { font-size: 1.25rem !important; }
  .position-relative { position: relative !important; }
  .z-2 { z-index: 2 !important; }
  .bg-black { background-color: #000 !important; }
  .bg-darker { background-color: #050505 !important; }
"""

# Append this CSS to the styled component PageWrapper
content = content.replace("const PageWrapper = styled.div`", f"const PageWrapper = styled.div`{css_grid}")

with open('src/Nutrition.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
