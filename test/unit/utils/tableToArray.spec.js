import { tableToArray } from '../../../src/plugins/copyPaste/utils.js';

describe('TableToArray', () => {
    
    it('Should parse 2d table', () => {
      const input2d = String.raw`<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      
      <head>
      <meta http-equiv=Content-Type content="text/html; charset=utf-8">
      <meta name=ProgId content=Excel.Sheet>
      <meta name=Generator content="Microsoft Excel 14">
      <style>
      <!--table
          {mso-displayed-thousand-separator:" ";}
      @page
          {margin:.75in .7in .75in .7in;
          mso-header-margin:.3in;
          mso-footer-margin:.3in;}
      tr
          {mso-height-source:auto;}
      col
          {mso-width-source:auto;}
      br
          {mso-data-placement:same-cell;}
      td
          {padding-top:1px;
          padding-right:1px;
          padding-left:1px;
          mso-ignore:padding;
          color:black;
          font-size:11.0pt;
          font-weight:400;
          font-style:normal;
          text-decoration:none;
          font-family:Calibri, sans-serif;
          mso-font-charset:238;
          mso-number-format:General;
          text-align:general;
          vertical-align:bottom;
          border:none;
          mso-background-source:auto;
          mso-pattern:auto;
          mso-protection:locked visible;
          white-space:nowrap;
          mso-rotate:0;}
      -->
      </style>
      </head>
      
      <body link=blue vlink=purple>
      
      <table border=0 cellpadding=0 cellspacing=0 width=128 style='border-collapse:
       collapse;width:96pt'>
      <!--StartFragment-->
       <col width=64 span=2 style='width:48pt'>
       <tr height=20 style='height:15.0pt'>
        <td height=20 align=right width=64 style='height:15.0pt;width:48pt'>1</td>
        <td align=right width=64 style='width:48pt'>3</td>
       </tr>
       <tr height=20 style='height:15.0pt'>
        <td height=20 align=right style='height:15.0pt'>2</td>
        <td align=right>4</td>
       </tr>
      <!--EndFragment-->
      </table>
      
      </body>
      
      </html>      
      `;

      const result = tableToArray(input2d);

      expect(result).toEqual([["1","3"],["2","4"]]);

    });

    it('Handles large data', ()=>{
        let largeInput = "<table>";
        const largeOutput = []

        const length = 4000;
        for (let i = 0; i < length; i++) {
            largeInput += String.raw`"<tr height=20 style='height:15.0pt'>
            <td height=20 align=right style='height:15.0pt'>154</td>
           </tr>`;
           largeOutput.push(["154"]);
        }
        largeInput += "</table>";

        console.time("Large data time");
        const result = tableToArray(largeInput);
        console.timeEnd("Large data time");
        expect(result).toEqual(largeOutput);
         
    });
});