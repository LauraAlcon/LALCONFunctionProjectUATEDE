/**
 * Describe mytestquerybofunction here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
 
 "use strict";

 export default async function (event, context, logger) {
    logger.info(
    `Invoking salesforcesdkjs Function with payload ${JSON.stringify(
      event.data || {}
    )}`
  );

  // Create a unit of work that inserts multiple objects.
  const uow = context.org.dataApi.newUnitOfWork();
 
   // Extract Properties from Payload
   const { limite, s3bucket, s3key, clientid, codedemand, createddate, cups, invoicedate, fiscalcode, rcompanycode, passcode, processcode, companycode, sequential, cxsd } = event.data;

   //Initialize soql
   var soql;

 
   // Validate the payload params and create query
   
   if (!limite) {
    //throw new Error(`Please provide limit value`);
    throw new Error(`Please provide the limit value`);
  }

  if (!cxsd) {
    //throw new Error(`Please provide XSD value`);
    throw new Error(`Please provide the XSD value`);
  }

 
  if (cxsd && createddate && companycode && cups && fiscalcode){

    soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
    WHERE Xsd__c = '${event.data.cxsd}' AND Created_date__c = ${event.data.createddate} AND Issuing_Company_Code__c = '${event.data.companycode}' AND CUPS__c = '${event.data.cups}' AND 
    Invoice_Fiscal_Code__c = '${event.data.fiscalcode}' LIMIT ${event.data.limite} `;

    console.log(`5`);

    console.log(soql);

  } else if (cxsd && createddate && companycode && cups && !fiscalcode) {

    // Query Big Object using the SalesforceSDK DataApi using the 4 fields in the index
    soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
    WHERE Xsd__c = '${event.data.cxsd}' AND Created_date__c = ${event.data.createddate} AND Issuing_Company_Code__c = '${event.data.companycode}' AND CUPS__c = '${event.data.cups}' 
     LIMIT ${event.data.limite} `;

     console.log(`4`);

     console.log(soql);

  } else if (cxsd && createddate && companycode && !cups && !fiscalcode){

    // Query Big Object using the SalesforceSDK DataApi using the 3 fields in the index
    soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
    WHERE Xsd__c = '${event.data.cxsd}' AND Created_date__c = ${event.data.createddate} AND Issuing_Company_Code__c = '${event.data.companycode}' LIMIT ${event.data.limite} `;

    console.log(`3`);

    console.log(soql);

  } else if (cxsd && createddate && !companycode && !cups && !fiscalcode){

     // Query Big Object using the SalesforceSDK DataApi using the 2 fields in the index
     soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
     WHERE Xsd__c = '${event.data.cxsd}' AND Created_date__c = ${event.data.createddate} LIMIT ${event.data.limite} `;

     console.log(`2`);

     console.log(soql);

  } else if (cxsd && !createddate && !companycode && !cups && !fiscalcode){

    // Query Big Object using the SalesforceSDK DataApi using the 2 fields in the index
    soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
    WHERE Xsd__c = '${event.data.cxsd}' LIMIT ${event.data.limite} `;

    console.log(`1`);

    console.log(soql);

  } else {

    soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b 
      WHERE Xsd__c = '${event.data.cxsd}' LIMIT ${event.data.limite} `;

      console.log(`default!!!!`);

  }

  
     // Query Big Object using the SalesforceSDK DataApi 
     //const soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b WHERE Xsd__c = '${event.data.cxsd}' AND Created_date__c <= ${event.data.createddate} LIMIT ${event.data.limite} `;

     console.log(`SOQL Final ... `);

     console.log(soql);


     const queryRes = await context.org.dataApi.query(soql);

     const queryResults = queryRes.records;


    for (const edato of queryResults){

        //console.log(edato);

        // Define a record using the RecordForCreate type and providing the Developer Name
        var vdata = uow.registerCreate({
            type: "CTR_F1_invoice_Mirror__c",
            fields: {
                    S3_Bucket__c: edato.fields.s3_bucket__c, 
                    S3_Key__c: edato.fields.s3_key__c, 
                    Client_Identifier__c: edato.fields.client_identifier__c, 
                    Code_Demand_Case_XML__c: edato.fields.code_demand_case_xml__c, 
                    CUPS__c: edato.fields.cups__c, 
                    Invoice_Date__c: edato.fields.invoice_date__c, 
                    Invoice_Fiscal_Code__c: edato.fields.invoice_fiscal_code__c, 
                    Issuing_Company_Code__c: edato.fields.issuing_company_code__c, 
                    Pass_Code__c: edato.fields.pass_code__c, 
                    Process_Code__c: edato.fields.process_code__c, 
                    Receiving_Company_Code__c: edato.fields.receiving_company_code__c, 
                    Sequential__c: edato.fields.sequential__c, 
                    Xsd__c: edato.fields.xsd__c,
                    F1_enlace__c: "a7y5r000000Gunu",
                },
        });

        //console.log(edato.fields.code_demand_case_xml__c);
            
    }
       
    try {

        // Commit the Unit of Work with all the previous registered operations
        const response = await context.org.dataApi.commitUnitOfWork(uow);

        //console.log(response);
        // Construct the result by getting the Id from the successful inserts

        return uow;
        //return queryResults;

    } catch (err) {
     // Catch any DML errors and pass the throw an error with the message
     const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
     logger.error(errorMessage);
     
     console.log(errorMessage);
     throw new Error(errorMessage);
    }

 }

