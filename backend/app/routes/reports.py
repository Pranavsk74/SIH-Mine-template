from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import io
import time

# ReportLab imports for server-side PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

router = APIRouter(prefix="/api/reports", tags=["reports"])

# In-memory storage for reports
reports_db: Dict[str, Dict[str, Any]] = {}

class GenerateReportRequest(BaseModel):
    missionId: Optional[str] = "MINE-04"
    rover: Optional[str] = "MINE SENSE ROVER-01"
    location: Optional[str] = "TUNNEL B-04"
    status: Optional[str] = "HIGH"
    riskScore: Optional[int] = 67
    primaryHazard: Optional[str] = "Methane Anomaly & Elevated CO"
    workersDetected: Optional[int] = 1
    sensors: Optional[Dict[str, Any]] = None
    ai: Optional[Dict[str, Any]] = None
    workerData: Optional[Dict[str, Any]] = None
    missionState: Optional[str] = "ACTIVE"

@router.post("/generate")
def generate_report(req: GenerateReportRequest):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    report_id = f"MINE-{int(time.time()) % 10000:04d}"

    sensors_data = req.sensors or {
        "CH4": "1.8 %",
        "CO": "34.2 PPM",
        "Temperature": "32.4 °C",
        "Humidity": "78.5 %",
        "Vibration": "0.14 g"
    }

    ai_data = req.ai or {
        "sensorModel": "LSTM Temporal Net",
        "visionModel": "YOLO v8 Thermal Perception",
        "fusion": "Multimodal Vector Fusion",
        "classifier": "MLP Classifier"
    }

    report_obj = {
        "id": report_id,
        "timestamp": timestamp,
        "missionId": req.missionId or "MINE-04",
        "rover": req.rover or "MINE SENSE ROVER-01",
        "location": req.location or "TUNNEL B-04",
        "status": req.status or "HIGH",
        "riskScore": req.riskScore if req.riskScore is not None else 67,
        "primaryHazard": req.primaryHazard or "Methane Anomaly & Elevated CO",
        "workersDetected": req.workersDetected if req.workersDetected is not None else 1,
        "sensors": sensors_data,
        "ai": ai_data,
        "missionState": req.missionState or "ACTIVE",
        "summary": "Autonomous rover completed initial shaft scanning in Tunnel B-04. Elevated CH4 and CO concentrations verified. Multimodal thermal LWIR vision confirmed 1 trapped miner at 37m distance.",
        "recommendation": "Proceed with remote environmental stabilization before human entry. Maintain sub-GHz RF mesh link and continuous gas sampling."
    }

    reports_db[report_id] = report_obj
    return report_obj

@router.get("")
def list_reports():
    return list(reports_db.values())

@router.get("/{report_id}")
def get_report(report_id: str):
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    return reports_db[report_id]

@router.get("/{report_id}/pdf")
def get_report_pdf(report_id: str):
    if report_id not in reports_db:
        # Fallback to demo report if not found
        report = {
            "id": report_id,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "missionId": "MINE-04",
            "rover": "MINE SENSE ROVER-01",
            "location": "TUNNEL B-04",
            "status": "HIGH",
            "riskScore": 67,
            "primaryHazard": "Methane Anomaly & Elevated CO",
            "workersDetected": 1,
            "sensors": {
                "CH4": "1.8 %",
                "CO": "34.2 PPM",
                "Temperature": "32.4 °C",
                "Humidity": "78.5 %",
                "Vibration": "0.14 g"
            },
            "ai": {
                "sensorModel": "LSTM Temporal Net",
                "visionModel": "YOLO v8 Thermal Perception",
                "fusion": "Multimodal Vector Fusion",
                "classifier": "MLP Classifier"
            },
            "missionState": "ACTIVE",
            "summary": "Autonomous rover completed initial shaft scanning in Tunnel B-04. Elevated CH4 and CO concentrations verified. Multimodal thermal LWIR vision confirmed 1 trapped miner at 37m distance.",
            "recommendation": "Proceed with remote environmental stabilization before human entry. Maintain sub-GHz RF mesh link and continuous gas sampling."
        }
    else:
        report = reports_db[report_id]

    pdf_bytes = build_pdf_document(report)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=MINE_SENSE_REPORT_{report['id']}.pdf"}
    )


def build_pdf_document(report: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    story = []

    # Palette
    c_cream = colors.HexColor("#fbf7ef")
    c_plum = colors.HexColor("#35152e")
    c_burgundy = colors.HexColor("#641f2d")
    c_gold = colors.HexColor("#ffbd32")
    c_orange = colors.HexColor("#ef6c22")
    c_dark = colors.HexColor("#241719")
    c_muted = colors.HexColor("#7d3e2d")

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_plum,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_orange,
        alignment=TA_LEFT
    )

    section_heading = ParagraphStyle(
        'SecHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_burgundy,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_dark
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    # Header section
    story.append(Paragraph("MINE SENSE // MISSION INTELLIGENCE REPORT", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"INCIDENT REPORT — {report['id']}", title_style))
    story.append(Spacer(1, 10))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>REPORT ID:</b> " + report["id"], body_style),
            Paragraph("<b>DATE/TIME:</b> " + report["timestamp"], body_style),
            Paragraph("<b>ROVER:</b> " + report["rover"], body_style)
        ],
        [
            Paragraph("<b>LOCATION:</b> " + report["location"], body_style),
            Paragraph("<b>MISSION STATE:</b> " + report["missionState"], body_style),
            Paragraph("<b>WORKERS LOCATED:</b> " + str(report["workersDetected"]), body_style)
        ]
    ]

    t_meta = Table(meta_data, colWidths=[170, 180, 180])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_cream),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e0d4c8")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # Risk Assessment Box
    risk_color = c_orange if report["status"] in ["HIGH", "CRITICAL"] else c_gold
    risk_text = f"RISK INDEX: {report['riskScore']}/100 — STATUS: {report['status']}"
    risk_table = Table(
        [[Paragraph(risk_text, badge_style)]],
        colWidths=[530]
    )
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), risk_color),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 12))

    # Mission Summary
    story.append(Paragraph("1. MISSION SUMMARY & HAZARD ASSESSMENT", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=c_burgundy, spaceAfter=8))
    story.append(Paragraph(report["summary"], body_style))
    story.append(Spacer(1, 10))

    # Environmental Sensors Table
    story.append(Paragraph("2. REAL-TIME ATMOSPHERIC SENSOR TELEMETRY", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=c_burgundy, spaceAfter=8))

    sensors = report["sensors"]
    s_rows = [["SENSOR CHANNEL", "READOUT VALUE", "THRESHOLD EVALUATION"]]
    for k, v in sensors.items():
        val_str = str(v)
        eval_str = "ELEVATED" if k.upper() in ["CH4", "CO"] else "SAFE"
        s_rows.append([k.upper(), val_str, eval_str])

    t_sensors = Table(s_rows, colWidths=[180, 170, 180])
    t_sensors.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_plum),
        ('TEXTCOLOR', (0,0), (-1,0), c_gold),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#dcd0c4")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#faf6f0")),
    ]))
    story.append(t_sensors)
    story.append(Spacer(1, 12))

    # AI & Deep Learning Analysis
    story.append(Paragraph("3. MULTIMODAL DEEP LEARNING ANALYSIS", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=c_burgundy, spaceAfter=8))

    ai = report["ai"]
    ai_rows = [
        [Paragraph("<b>Sensor Model (LSTM):</b> " + str(ai.get("sensorModel", "LSTM")), body_style),
         Paragraph("<b>Vision Perception (YOLO):</b> " + str(ai.get("visionModel", "YOLO")), body_style)],
        [Paragraph("<b>Feature Fusion Engine:</b> " + str(ai.get("fusion", "Feature Fusion")), body_style),
         Paragraph("<b>Risk Classifier:</b> " + str(ai.get("classifier", "MLP Classifier")), body_style)]
    ]
    t_ai = Table(ai_rows, colWidths=[265, 265])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_cream),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#dcd0c4")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 12))

    # Recommendation & Action Plan
    story.append(Paragraph("4. RECOMMENDED ACTION PLAN", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=c_burgundy, spaceAfter=8))
    story.append(Paragraph(report["recommendation"], body_style))
    story.append(Spacer(1, 16))

    # Disclaimer Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"), spaceAfter=6))
    disc_style = ParagraphStyle('Disc', parent=body_style, fontSize=8, leading=10, textColor=c_muted, alignment=TA_CENTER)
    story.append(Paragraph("MINE SENSE AI-POWERED MINE SAFETY & RESCUE ROVER — DEMO & SIMULATED HACKATHON REPORT", disc_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
