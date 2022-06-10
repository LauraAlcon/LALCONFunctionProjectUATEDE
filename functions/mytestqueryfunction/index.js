/**
 * Describe mytestqueryfunction here.
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
 
   // Extract Properties from Payload
   const { s3bucket, s3key, clientid, codedemand, createddate,cups, invoicedate, fiscalcode, rcompanycode, passcode, processcode, companycode, sequential, xsd } = event.data;

 
   // Validate the payload params
   if (!cups) {
     //throw new Error(`Please provide CUP value`);
     throw new Error(`Please provide the CUP value`);
   }
 
   // Define a record using the RecordForCreate type and providing the Developer Name
   const testdata = {
     type: "CTR_F1_invoice__b",
     fields: {
       S3_Bucket__c: s3bucket, 
       S3_Key__c: s3key, 
       Client_Identifier__c: clientid, 
       Code_Demand_Case_XML__c: codedemand, 
       Created_date__c: createddate,
       CUPS__c: cups, 
       Invoice_Date__c: invoicedate, 
       Invoice_Fiscal_Code__c: fiscalcode, 
       Issuing_Company_Code__c: companycode, 
       Pass_Code__c: passcode, 
       Process_Code__c: processcode, 
       Receiving_Company_Code__c: rcompanycode, 
       Sequential__c: sequential, 
       Xsd__c: xsd,
     },
   };
 
   try {
     // Insert the record using the SalesforceSDK DataApi and get the new Record Id from the result
     const { id: recordId } = await context.org.dataApi.create(testdata);
 
     // Query Accounts using the SalesforceSDK DataApi to verify that our new Account was created.
     const soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b WHERE Xsd__c= '0' AND Created_date__c > 2022-05-25T00:00:00.000+0000`;
     const queryResults = await context.org.dataApi.query(soql);
     return queryResults;
   } catch (err) {
     // Catch any DML errors and pass the throw an error with the message
     const errorMessage = `Failed to insert record. Root Cause: ${err.message}`;
     logger.error(errorMessage);
     throw new Error(errorMessage);
   }
 }
