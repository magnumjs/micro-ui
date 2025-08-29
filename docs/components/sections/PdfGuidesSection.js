export const PdfGuidesSection = {
  mount(target) {
    target.innerHTML = `
      <h2>Available PDF Guides</h2>
      <ul>
        <li><a href="pdf/MagnumJS_MicroUI_QuickStart.pdf" target="_blank">MagnumJS MicroUI QuickStart PDF</a></li>
        <li><a href="pdf/MagnumJS_MicroUI_DevGuide.pdf" target="_blank">MagnumJS MicroUI DevGuide PDF</a></li>
        <li><a href="pdf/MicroUI_Components_Guide.pdf" target="_blank">MicroUI Components Guide PDF</a></li>
        <li><a href="pdf/MicroUI_API_Guide.pdf" target="_blank">MicroUI API Guide PDF</a></li>
        <li><a href="pdf/How%20to%20Add%20a%20Live%20Code%20Example%20to%20MicroUI%20Docs.pdf" target="_blank">How to Add a Live Code Example to MicroUI Docs PDF</a></li>
        <li><a href="pdf/MicroUI%20Docs%20-Advanced%20Live%20Example%20Contribution%20Guide.pdf" target="_blank">MicroUI Docs - Advanced Live Example Contribution Guide PDF</a></li>
      </ul>
      <hr />
      <p>All guides are available for download and offline viewing.</p>
    `;
  }
};
