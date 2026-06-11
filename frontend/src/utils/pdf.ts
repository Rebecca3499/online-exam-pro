import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { formatSeconds } from './format'

export async function exportResultPdf(result: any, element?: HTMLElement | null) {
  if (element) {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      ignoreElements: (node) => node instanceof HTMLElement && node.classList.contains('pdf-ignore')
    })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL('image/png')
    let position = 0
    let remainingHeight = imgHeight

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    remainingHeight -= pageHeight
    while (remainingHeight > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      remainingHeight -= pageHeight
    }
    pdf.save(`exam-report-${result.id}.pdf`)
    return
  }

  const doc = new jsPDF()
  let y = 18
  doc.setFontSize(18)
  doc.text('Online Exam Pro Report', 14, y)
  y += 12
  doc.setFontSize(11)
  const rows = [
    `Exam: ${result.exam_title}`,
    `Student: ${result.student_name}`,
    `Score: ${result.score}/${result.total_score}`,
    `Accuracy: ${result.accuracy}%`,
    `Used Time: ${formatSeconds(result.duration_used)}`,
    `Switch Count: ${result.switch_count}`,
    `Timeout: ${result.is_timeout ? 'Yes' : 'No'}`,
    `Submitted At: ${result.submitted_at}`
  ]
  rows.forEach((line) => {
    doc.text(line, 14, y)
    y += 8
  })
  y += 4
  doc.setFontSize(13)
  doc.text('Wrong Question Analysis', 14, y)
  y += 9
  doc.setFontSize(10)
  ;(result.detail || []).filter((item: any) => !item.isCorrect).forEach((item: any, index: number) => {
    if (y > 270) {
      doc.addPage()
      y = 18
    }
    const title = `${index + 1}. ${item.title}`
    doc.text(doc.splitTextToSize(title, 180), 14, y)
    y += 10
    doc.text(`Your: ${item.userAnswer || '-'}  Correct: ${item.correctAnswer}`, 14, y)
    y += 7
    doc.text(doc.splitTextToSize(`Analysis: ${item.analysis || '-'}`, 180), 14, y)
    y += 13
  })
  doc.save(`exam-report-${result.id}.pdf`)
}
