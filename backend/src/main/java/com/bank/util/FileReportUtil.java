package com.bank.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import org.slf4j.LoggerFactory;

public class FileReportUtil {
	
	private static final String REPORT_FOLDER = "reports";
	private static final String REPORT_FILE = REPORT_FOLDER+"/transactions_reports.txt";
	
	static {
		File folder = new File(REPORT_FOLDER);
		if(!folder.exists()) {
			folder.mkdir();
		}
	}
	
	public static void writeLine(String line){
		try(BufferedWriter bw = new BufferedWriter(new FileWriter(REPORT_FILE,true))){
			bw.write(line);
			bw.newLine();
		}
		catch(IOException e) {
			LoggerFactory.getLogger(FileReportUtil.class).error("File report write failed", e);
		}
	}
}
